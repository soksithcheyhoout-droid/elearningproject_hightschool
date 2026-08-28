import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force IPv4 first — Render / cloud environments compatibility
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Custom strict IPv4 DNS lookup
const ipv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: false }, (err, address) => {
    if (err) {
      return callback(null, '142.250.185.108', 4);
    }
    callback(null, address, 4);
  });
};

// Create Gmail SMTP transporter with authentic Google connection
const createTransporter = (port = 465, secure = true) => {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'soksithcheyhoout@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'hkxlhzduvlkgbeqg').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  // 1. If standard Gmail port 465 (SSL direct)
  if (port === 465) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 12000,
      greetingTimeout: 8000,
      socketTimeout: 12000
    });
  }

  // 2. Custom host & port fallback
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    family: 4,
    lookup: ipv4Lookup,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 12000,
    greetingTimeout: 8000,
    socketTimeout: 12000
  });
};

// Send email via HTTPS API fallback (Port 443) if SMTP is blocked
const sendViaHttpApi = async (toEmail, subject, htmlContent, plainText) => {
  // 1. Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MoEYS E-Learning <onboarding@resend.dev>',
          to: [toEmail],
          subject,
          html: htmlContent,
          text: plainText
        })
      });
      const data = await resp.json();
      if (resp.ok && data.id) {
        console.log(`✅ [Resend HTTPS Success]: Email sent to ${toEmail} (ID: ${data.id})`);
        return { success: true, sentViaSmtp: true, messageId: data.id };
      }
    } catch (err) {
      console.warn('⚠️ [Resend HTTPS Error]:', err.message);
    }
  }

  // 2. Brevo API
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'MoEYS E-Learning', email: 'soksithcheyhoout@gmail.com' },
          to: [{ email: toEmail }],
          subject,
          htmlContent,
          textContent: plainText
        })
      });
      const data = await resp.json();
      if (resp.ok && data.messageId) {
        console.log(`✅ [Brevo HTTPS Success]: Email sent to ${toEmail} (ID: ${data.messageId})`);
        return { success: true, sentViaSmtp: true, messageId: data.messageId };
      }
    } catch (err) {
      console.warn('⚠️ [Brevo HTTPS Error]:', err.message);
    }
  }

  // 3. Google Apps Script Webhook Fallback
  const googleScriptUrl = (process.env.GMAIL_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxu8QZ0wiuVkWBIoWhjmEoi7-I2LvgdTKWf8mE1tK2odHGKVnifh2wblxEzc7tEeU8S5w/exec').trim();
  if (googleScriptUrl) {
    try {
      const resp = await fetch(googleScriptUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          to: toEmail,
          subject,
          htmlBody: htmlContent,
          body: plainText
        })
      });
      const resText = await resp.text();
      if (resp.ok && resText.includes('success')) {
        console.log(`✅ [Google Apps Script HTTPS Success]: OTP Email sent to ${toEmail}`);
        return { success: true, sentViaSmtp: true };
      }
    } catch (err) {
      console.warn('⚠️ [Google Apps Script HTTPS Error]:', err.message);
    }
  }

  return null;
};

/**
 * Send 6-Digit OTP Security Code with Guaranteed Inbox Placement
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - 6-digit verification code
 * @param {string} purpose - 'login' | 'register' | 'reset'
 */
export const sendOtpEmail = async (toEmail, otpCode, purpose = 'login') => {
  // Log to server terminal for instant development & debug
  console.log('\n========================================');
  console.log(`🔐 [MoEYS OTP GATEWAY] Destination: ${toEmail}`);
  console.log(`🔑 OTP CODE: >>> ${otpCode} <<< (Valid for 5 mins)`);
  console.log('========================================\n');

  const senderEmail = (process.env.SMTP_USER || process.env.GMAIL_USER || 'soksithcheyhoout@gmail.com').trim();
  const currentYear = new Date().getFullYear();

  // High-Trust Subject line matching Google/MoEYS standard (Prevents Spam classification)
  const subject = `[MoEYS] ${otpCode} គឺជាលេខកូដផ្ទៀងផ្ទាត់គណនីរបស់អ្នក (Verification Code)`;

  // Plaintext version for multipart/alternative MIME compliance
  const plainText = `[ក្រសួងអប់រំ យុវជន និងកីឡា - MoEYS Cambodia]\n\nលេខកូដផ្ទៀងផ្ទាត់សុវត្ថិភាពរបស់អ្នកគឺ៖ ${otpCode}\n(Security Verification PIN: ${otpCode})\n\nលេខកូដនេះមានសុពលភាពរយៈពេល ៥ នាទីសម្រាប់ចូលប្រើប្រាស់ ឬចុះឈ្មោះក្នុងប្រព័ន្ធ MoEYS E-Learning ។\n\nប្រសិនបើលោកអ្នកមិនបានស្នើសុំលេខកូដនេះទេ សូមមិនបាច់អើពើចំពោះអ៊ីមែលនេះ។\n\n© ${currentYear} MoEYS Cambodia. All rights reserved.`;

  // Clean, high-deliverability HTML layout with strict table formatting & inline styling
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="km">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoEYS Security Verification Code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b1329;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b1329;padding:30px 10px;">
      <tr>
        <td align="center">
          <!-- Main Email Container -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background-color:#0f172a;border-radius:18px;overflow:hidden;border:1px solid #1e293b;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#03152e 0%,#002b5b 100%);padding:30px 20px 24px;border-bottom:3px solid #f59e0b;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom:10px;">
                      <span style="font-size:32px;">🇰🇭 🎓</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="color:#fbbf24;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0;">
                      MINISTRY OF EDUCATION, YOUTH AND SPORT
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="color:#ffffff;font-size:16px;font-weight:700;padding-top:4px;">
                      ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top:8px;">
                      <span style="display:inline-block;background-color:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:700;">
                        ប្រព័ន្ធគ្រប់គ្រងការសិក្សាឌីជីថលថ្នាក់ជាតិ
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:32px 28px;background-color:#0f172a;text-align:center;">
                <h2 style="color:#ffffff;font-size:18px;font-weight:800;margin:0 0 10px;letter-spacing:-0.2px;">
                  លេខកូដផ្ទៀងផ្ទាត់សុវត្ថិភាព (OTP Code)
                </h2>
                <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 24px;">
                  សូមប្រើប្រាស់លេខកូដសម្ងាត់ <strong>៦ ខ្ទង់</strong> ខាងក្រោម ដើម្បីផ្ទៀងផ្ទាត់ចូលប្រើប្រាស់គណនីរបស់អ្នក៖
                </p>

                <!-- OTP Display Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 24px;width:100%;max-width:340px;">
                  <tr>
                    <td align="center" style="background:linear-gradient(135deg,#021a38 0%,#052c5c 100%);border-radius:14px;padding:20px;border:2px solid #0284c7;box-shadow:0 8px 24px rgba(2,132,199,0.3);">
                      <div style="color:#38bdf8;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">
                        Security Verification PIN
                      </div>
                      <div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#ffffff;font-family:'Courier New',Courier,monospace;padding-left:10px;">
                        ${otpCode}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Security Tips Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:#1e293b;border-radius:10px;border-left:4px solid #f59e0b;padding:14px 16px;text-align:left;">
                  <tr>
                    <td style="font-size:12px;color:#cbd5e1;line-height:1.5;">
                      <div style="margin-bottom:6px;">⏱️ លេខកូដនេះមានសុពលភាពត្រឹមតែ <strong>៥ នាទី</strong> ប៉ុណ្ណោះ។</div>
                      <div>🔒 សូមកុំចែករំលែកលេខកូដនេះទៅកាន់អ្នកដទៃ ដើម្បីសុវត្ថិភាពគណនី។</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color:#080e1a;padding:20px 20px;border-top:1px solid #1e293b;color:#64748b;font-size:11px;line-height:1.6;">
                <div style="font-weight:700;color:#94a3b8;margin-bottom:3px;">
                  © ${currentYear} ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Cambodia)
                </div>
                <div>Official National High School Digital Learning Platform</div>
                <div style="color:#475569;margin-top:6px;font-size:10px;">
                  សារនេះផ្ញើចេញដោយស្វ័យប្រវត្តិតាមរយៈ MoEYS SSO Authentication Gateway
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // Standard transactional Anti-Spam headers
  const emailHeaders = {
    'X-Priority': '1 (Highest)',
    'X-MSMail-Priority': 'High',
    'Importance': 'High',
    'Auto-Submitted': 'auto-generated',
    'X-Auto-Response-Suppress': 'All',
    'X-Entity-Ref-ID': `moeys-auth-${Date.now()}-${otpCode}`,
    'Reply-To': senderEmail
  };

  const mailOptions = {
    from: `"MoEYS Digital Learning" <${senderEmail}>`,
    to: toEmail,
    subject,
    text: plainText,
    html: htmlContent,
    headers: emailHeaders
  };

  // STEP 1: Direct Authenticated Gmail SMTP (Port 465 SSL) - Direct Google SPF & DKIM signature
  try {
    const transporter465 = createTransporter(465, true);
    if (transporter465) {
      const info465 = await transporter465.sendMail(mailOptions);
      console.log(`✅ [Gmail SMTP Success - Direct Port 465]: OTP Email delivered to Inbox ${toEmail} (ID: ${info465.messageId})`);
      return {
        success: true,
        sentViaSmtp: true,
        messageId: info465.messageId
      };
    }
  } catch (err465) {
    console.warn(`⚠️ [Gmail SMTP 465 Notice]: (${err465.message}). Retrying on Port 587 STARTTLS...`);
  }

  // STEP 2: Gmail SMTP Port 587 STARTTLS fallback
  try {
    const transporter587 = createTransporter(587, false);
    if (transporter587) {
      const info587 = await transporter587.sendMail(mailOptions);
      console.log(`✅ [Gmail SMTP Success - Port 587]: OTP Email delivered to ${toEmail} (ID: ${info587.messageId})`);
      return {
        success: true,
        sentViaSmtp: true,
        messageId: info587.messageId
      };
    }
  } catch (err587) {
    console.warn(`⚠️ [Gmail SMTP 587 Notice]: (${err587.message}). Trying HTTPS Fallback...`);
  }

  // STEP 3: HTTPS API Fallbacks (for restricted cloud firewall environments)
  const httpResult = await sendViaHttpApi(toEmail, subject, htmlContent, plainText);
  if (httpResult && httpResult.success) {
    return httpResult;
  }

  return {
    success: false,
    sentViaSmtp: false,
    error: 'All email delivery channels failed'
  };
};
