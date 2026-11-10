/**
 * Paylink Payment Gateway — Frontend Utility
 * -------------------------------------------
 * The browser NEVER talks to paylinkapibank.com directly and never sees the API key.
 * It only calls our own backend, which proxies the Paylink gateway using the server-side key.
 *
 *   createPaylinkPayment() -> POST /api/payment/create         (returns the KHQR string + tranId)
 *   checkPaylinkStatus()   -> GET  /api/payment/status/:tranId (polls webhook-confirmed settlement)
 */

export async function createPaylinkPayment({ amount = 1.0, currency = 'USD', billNumber = null } = {}) {
  try {
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount),
        currency: String(currency).toUpperCase() === 'KHR' ? 'KHR' : 'USD',
        billNumber
      })
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !data.success) {
      return { success: false, error: (data && data.error) || `Payment server returned HTTP ${response.status}` };
    }
    return data;
  } catch (error) {
    console.error('[Paylink Create Error]:', error);
    return { success: false, error: error.message || 'Failed to reach the payment server' };
  }
}

export async function checkPaylinkStatus(tranId) {
  if (!tranId) return { success: false, paid: false, status: 'ERROR' };

  try {
    const response = await fetch(`/api/payment/status/${encodeURIComponent(tranId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return { success: false, paid: false, status: 'ERROR' };
    return await response.json();
  } catch (error) {
    return { success: false, paid: false, status: 'ERROR', error: error.message };
  }
}
