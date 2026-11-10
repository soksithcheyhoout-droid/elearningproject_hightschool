import crypto from 'node:crypto';

/**
 * Paylink Payment Gateway Controller
 * -----------------------------------
 * Single, unified payment integration for the platform.
 * All payment traffic goes through paylinkapibank.com using the server-side API key.
 *
 * Endpoints consumed on the Paylink gateway:
 *   POST /payment/generate-qr   -> creates a dynamic EMVCo KHQR (ABA + Bakong rails), returns tranId + md5
 *   GET  /payment/check-payment -> best-effort status poll (used only if/when the gateway exposes it)
 *
 * Settlement confirmation is delivered by Paylink via a signed webhook (see handlePaylinkWebhook),
 * which is the authoritative source of "paid" status. The frontend polls /api/payment/status/:tranId,
 * which reads from the in-memory settlement ledger populated by that webhook.
 */

const PAYLINK_BASE_URL = (process.env.PAYLINK_BASE_URL || 'https://paylinkapibank.com/api/v2').replace(/\/+$/, '');
const PAYLINK_API_KEY = process.env.PAYLINK_API_KEY || '';
const PAYLINK_WEBHOOK_SECRET = process.env.PAYLINK_WEBHOOK_SECRET || '';

// ------------------------------------------------------------------
// In-memory settlement ledger: tranId -> settlement record
// Survives the ~5 minute checkout window; cleaned up hourly.
// ------------------------------------------------------------------
const settledTransactions = new Map();
const TXN_TTL_MS = 60 * 60 * 1000; // keep records for 1 hour

function rememberTransaction(tranId, data) {
  if (!tranId) return;
  settledTransactions.set(String(tranId), { ...data, receivedAt: Date.now() });
}

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of settledTransactions) {
    if (now - (val.receivedAt || 0) > TXN_TTL_MS) settledTransactions.delete(key);
  }
}, 10 * 60 * 1000);
if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();

/**
 * Paylink occasionally returns a JSON-encoded string body. Parse defensively.
 */
function parseMaybeJson(text) {
  let data = null;
  try { data = JSON.parse(text); } catch { return null; }
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { /* keep as string */ }
  }
  return data;
}

/**
 * Create a dynamic KHQR payment via Paylink.
 * POST /api/payment/create   body: { amount, currency, billNumber }
 */
export async function createPaylinkPayment(req, res) {
  try {
    if (!PAYLINK_API_KEY) {
      return res.status(500).json({ success: false, error: 'Payment gateway is not configured (missing PAYLINK_API_KEY).' });
    }

    const { amount = 1, currency = 'USD', billNumber } = req.body || {};
    const curr = String(currency).toUpperCase() === 'KHR' ? 'KHR' : 'USD';
    const amtNum = Number(amount) > 0 ? Number(amount) : 1;
    const bill = (billNumber && String(billNumber).trim()) || ('TXN' + Date.now());

    const resp = await fetch(`${PAYLINK_BASE_URL}/payment/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': PAYLINK_API_KEY
      },
      body: JSON.stringify({ amount: amtNum, currency: curr, billNumber: bill }),
      signal: AbortSignal.timeout(20000)
    });

    const text = await resp.text();
    const data = parseMaybeJson(text);

    if (!resp.ok || !data || typeof data !== 'object' || data.success === false) {
      const msg = (data && data.error) || `Paylink gateway error (HTTP ${resp.status})`;
      console.warn('[Paylink Create] Gateway rejected request:', msg);
      return res.status(502).json({ success: false, error: msg });
    }

    const tranId = String(data.tranId || data.transactionId || '');
    const qrString = data.qrString || data.qr || data.payload || '';

    if (!tranId || !qrString) {
      return res.status(502).json({ success: false, error: 'Paylink gateway did not return a QR string or transaction id.' });
    }

    return res.json({
      success: true,
      gateway: 'paylink',
      bank: data.bank || 'BAKONG',
      tranId,
      qrString,
      md5: data.md5 || '',
      deepLink: data.deepLink || data.deeplink || '',
      amount: Number(data.amount ?? amtNum),
      amountFormatted: data.amountFormatted || (curr === 'KHR' ? String(Math.round(amtNum)) : amtNum.toFixed(2)),
      currency: data.currency || curr,
      merchantName: data.merchantName || '',
      status: data.status || 'PENDING'
    });
  } catch (error) {
    console.error('[Paylink Create Error]:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create Paylink payment.' });
  }
}

/**
 * Check settlement status of a transaction.
 * GET /api/payment/status/:tranId
 *
 * Primary source  : webhook-confirmed settlement ledger (authoritative).
 * Fallback source : Paylink gateway status endpoint (best-effort; silently ignored if unavailable).
 */
export async function checkPaylinkStatus(req, res) {
  const tranId = String(req.params.tranId || '').trim();
  if (!tranId) {
    return res.status(400).json({ success: false, paid: false, status: 'ERROR', error: 'Missing transaction id.' });
  }

  // 1. Authoritative: webhook settlement ledger
  const settled = settledTransactions.get(tranId);
  if (settled && settled.paid) {
    return res.json({
      success: true,
      paid: true,
      status: 'PAID',
      source: 'webhook',
      amount: settled.amount,
      currency: settled.currency,
      payerAccount: settled.payerAccount,
      payerBank: settled.payerBank,
      settledAt: settled.settledAt
    });
  }

  // 2. Best-effort: ask the gateway directly (works only if/when Paylink exposes this route).
  if (PAYLINK_API_KEY) {
    try {
      const resp = await fetch(`${PAYLINK_BASE_URL}/payment/check-payment?tranId=${encodeURIComponent(tranId)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'x-api-key': PAYLINK_API_KEY },
        signal: AbortSignal.timeout(8000)
      });
      const ct = resp.headers.get('content-type') || '';
      if (resp.ok && ct.includes('application/json')) {
        const data = parseMaybeJson(await resp.text());
        if (data && typeof data === 'object') {
          const status = String(data.status || '').toUpperCase();
          const paid = data.paid === true || ['PAID', 'SUCCESS', 'COMPLETED', 'APPROVED', 'SETTLED'].includes(status);
          if (paid) {
            rememberTransaction(tranId, {
              paid: true,
              status: 'PAID',
              amount: data.amount,
              currency: data.currency,
              settledAt: data.settledAt || new Date().toISOString()
            });
            return res.json({ success: true, paid: true, status: 'PAID', source: 'gateway' });
          }
          return res.json({ success: true, paid: false, status: status || 'PENDING', source: 'gateway' });
        }
      }
    } catch {
      // Gateway status endpoint unavailable — fall through to pending.
    }
  }

  return res.json({ success: true, paid: false, status: 'PENDING', source: 'ledger' });
}

/**
 * Verify a Paylink webhook signature using the shared webhook secret.
 * The exact header/scheme is not publicly documented, so this checks the common
 * conventions: HMAC-SHA256 of the raw body (hex or base64), optional "sha256=" prefix,
 * and Stripe-style "t=<ts>,v1=<hex>" signing of "<ts>.<rawBody>".
 *
 * Returns one of:
 *   { status: 'verified' }  signature present and valid
 *   { status: 'invalid' }   signature present but does NOT match  -> reject
 *   { status: 'unsigned' }  no recognized signature header         -> accept (scheme unknown), flagged
 *   { status: 'skipped' }   verification disabled / no secret      -> accept
 */
function verifyPaylinkSignature(rawBody, headers, secret) {
  if (!secret) return { status: 'skipped', reason: 'no webhook secret configured' };
  if (process.env.PAYLINK_WEBHOOK_SKIP_VERIFY === 'true') return { status: 'skipped', reason: 'verification disabled via env' };

  const headerNames = [
    'x-paylink-signature', 'paylink-signature', 'x-paylink-sign',
    'x-signature', 'x-webhook-signature', 'webhook-signature',
    'x-hub-signature-256', 'signature'
  ];

  let provided = null;
  let headerName = null;
  for (const name of headerNames) {
    if (headers[name]) { provided = String(headers[name]).trim(); headerName = name; break; }
  }
  if (!provided) return { status: 'unsigned', reason: 'no recognized signature header present' };

  const hmacHex = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const hmacB64 = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  // Stripe-style compound signature: t=<timestamp>,v1=<hex>
  const compound = provided.match(/t=([^,]+).*?v1=([0-9a-fA-F]+)/);
  if (compound) {
    const signed = `${compound[1]}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(signed, 'utf8').digest('hex');
    if (timingSafeEq(expected, compound[2])) return { status: 'verified', reason: `stripe-style ${headerName}` };
  }

  const providedClean = provided.replace(/^sha256=/i, '').trim();
  for (const candidate of [hmacHex, hmacB64]) {
    if (timingSafeEq(providedClean, candidate)) return { status: 'verified', reason: headerName };
  }

  return { status: 'invalid', reason: `signature mismatch on ${headerName}` };
}

function timingSafeEq(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  try { return crypto.timingSafeEqual(ba, bb); } catch { return false; }
}

/**
 * Receive settlement callbacks from Paylink.
 * POST /api/payment/webhook
 *
 * Example payload:
 *   { "event":"payment.success", "tranId":"TRX_...", "amount":12.50, "currency":"USD",
 *     "payerAccount":"000123456@abaa", "payerBank":"ABA Bank", "settledAt":"2026-11-09T02:00:00Z" }
 */
export function handlePaylinkWebhook(req, res) {
  try {
    const raw = req.rawBody
      ? req.rawBody.toString('utf8')
      : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    const verification = verifyPaylinkSignature(raw, req.headers, PAYLINK_WEBHOOK_SECRET);
    if (verification.status === 'invalid') {
      console.warn('[Paylink Webhook] REJECTED - invalid signature:', verification.reason);
      return res.status(401).json({ received: false, error: 'Invalid signature' });
    }
    if (verification.status === 'unsigned') {
      console.warn('[Paylink Webhook] Accepting event WITHOUT a verified signature (no recognized signature header). Set the correct scheme once known.');
    }

    let payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      try { payload = JSON.parse(raw); } catch { payload = {}; }
    }

    const event = String(payload.event || payload.type || '');
    const tranId = String(payload.tranId || payload.transactionId || payload.tran_id || '');
    const statusStr = String(payload.status || '');
    const isSuccess =
      /success|paid|completed|settled/i.test(event) ||
      payload.paid === true ||
      /^(paid|success|completed|settled|approved)$/i.test(statusStr);

    if (tranId && isSuccess) {
      rememberTransaction(tranId, {
        paid: true,
        status: 'PAID',
        event,
        amount: payload.amount,
        currency: payload.currency,
        payerAccount: payload.payerAccount,
        payerBank: payload.payerBank,
        settledAt: payload.settledAt || new Date().toISOString(),
        verified: verification.status === 'verified'
      });
      console.log(`[Paylink Webhook] Settled tranId=${tranId} amount=${payload.amount} ${payload.currency || ''} (verified=${verification.status === 'verified'})`);
    } else {
      console.log(`[Paylink Webhook] Received event="${event}" tranId="${tranId}" status="${statusStr}" (no settlement recorded)`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Paylink Webhook Error]:', error);
    // Acknowledge receipt to avoid aggressive gateway retries on our own processing bug.
    return res.status(200).json({ received: true });
  }
}
