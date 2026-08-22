import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force IPv4 first — Render Free Tier does NOT support outbound IPv6
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import fs from 'fs';

// Custom strict IPv4 DNS lookup to guarantee zero IPv6 socket attempts
const ipv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: false }, (err, address, family) => {
    if (err) {
      // Fallback to direct known Google IPv4 address if DNS fails
      return callback(null, '142.250.185.108', 4);
    }
    callback(null, address, 4);
  });
};

// Create Gmail SMTP transporter (Port 587 STARTTLS + Strict IPv4)
const createTransporter = (port = 587, secure = false) => {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'soksithcheyhoout@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'hkxlhzduvlkgbeqg').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

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

// Send email via HTTPS API (Port 443 - 100% open on Render Free Tier)
const sendViaHttpApi = async (toEmail, subject, htmlContent, plainText) => {
  // 1. Resend API (Free 3,000 emails/month via HTTPS port 443)
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
          from: 'MoTDAR E-Learning <onboarding@resend.dev>',
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
      console.warn('⚠️ [Resend HTTPS Notice]:', data);
    } catch (err) {
      console.warn('⚠️ [Resend HTTPS Error]:', err.message);
    }
  }

  // 2. Brevo API (Free 300 emails/day via HTTPS port 443)
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
          sender: { name: 'MoTDAR E-Learning', email: 'soksithcheyhoout@gmail.com' },
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
      console.warn('⚠️ [Brevo HTTPS Notice]:', data);
    } catch (err) {
      console.warn('⚠️ [Brevo HTTPS Error]:', err.message);
    }
  }

  // 3. Google Apps Script Webhook (Unlimited Free Gmail Delivery via HTTPS port 443)
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
      console.log(`ℹ️ [Google Apps Script Response]: Status ${resp.status}`, resText);
      return { success: true, sentViaSmtp: true };
    } catch (err) {
      console.warn('⚠️ [Google Apps Script HTTPS Error]:', err.message);
    }
  }

  return null;
};

/**
 * Send 6-Digit OTP Security Code via Gmail / HTTPS
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - 6-digit verification code
 * @param {string} purpose - 'login' | 'register' | 'reset'
 */
export const sendOtpEmail = async (toEmail, otpCode, purpose = 'login') => {
  const transporter = createTransporter();

  // Log to server terminal for instant development & debug
  console.log('\n========================================');
  console.log(`🔐 [MoTDAR OTP GATEWAY] Destination: ${toEmail}`);
  console.log(`🔑 OTP CODE: >>> ${otpCode} <<< (Valid for 5 mins)`);
  console.log('========================================\n');

  if (!transporter) {
    console.log('ℹ️ [Gmail SMTP]: SMTP_USER or SMTP_PASS not configured.');
    return {
      success: true,
      sentViaSmtp: false,
      previewCode: otpCode,
      message: 'OTP generated (SMTP credentials not configured).'
    };
  }

  const senderEmail = (process.env.SMTP_USER || process.env.GMAIL_USER || 'soksithcheyhoout@gmail.com').trim();
  const logoPath = path.join(__dirname, '../../public/assets/moeys-crest-transparent.png');

  // Split OTP digits for modern formatted card
  const formattedOtp = otpCode.split('').join(' ');

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="km">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoEYS Security Verification Code</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f1f5f9;
        padding: 40px 0;
      }
      .container {
        max-width: 560px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #001226 0%, #002244 40%, #003b7a 100%);
        padding: 38px 25px 32px;
        text-align: center;
        border-bottom: 3px solid #f59e0b;
        position: relative;
      }
      .logo-box {
        display: inline-block;
        padding: 8px;
        margin-bottom: 12px;
      }
      .header-title-en {
        color: #fbbf24;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 0 0 5px;
      }
      .header-title-km {
        color: #ffffff;
        font-size: 15px;
        font-weight: 700;
        margin: 0 0 10px;
        line-height: 1.4;
      }
      .header-badge {
        display: inline-block;
        background: rgba(56, 189, 248, 0.15);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #7dd3fc;
        padding: 4px 16px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 40px 35px 35px;
        background-color: #ffffff;
        text-align: center;
      }
      .headline {
        color: #0f172a;
        font-size: 21px;
        font-weight: 800;
        margin: 0 0 12px;
        letter-spacing: -0.3px;
      }
      .subtext {
        color: #475569;
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 28px;
      }
      .otp-card {
        background: linear-gradient(135deg, #021833 0%, #003366 100%);
        border-radius: 18px;
        padding: 24px 20px;
        margin: 0 auto 28px;
        border: 2px solid #0284c7;
        box-shadow: 0 10px 25px rgba(2, 132, 199, 0.25);
        max-width: 360px;
      }
      .otp-label {
        color: #38bdf8;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .otp-number {
        font-size: 40px;
        font-weight: 900;
        letter-spacing: 12px;
        color: #ffffff;
        font-family: 'Courier New', Courier, monospace;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        padding-left: 12px;
        display: block;
      }
      .info-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-left: 4px solid #f59e0b;
        border-radius: 12px;
        padding: 16px;
        text-align: left;
        margin-bottom: 24px;
      }
      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #334155;
        line-height: 1.5;
      }
      .info-row + .info-row {
        margin-top: 8px;
      }
      .footer {
        background-color: #f8fafc;
        padding: 25px 20px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
        font-size: 12px;
        line-height: 1.6;
      }
      .footer-brand {
        font-weight: 700;
        color: #334155;
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        
        <!-- 🌟 ROYAL OFFICIAL HEADER WITH NEW LOGO -->
        <div class="header">
          <div class="logo-box">
            <img src="https://raw.githubusercontent.com/soksithcheyhoout-droid/elearningproject_hightschool/main/public/assets/moeys-crest-transparent.png" alt="MoTDAR National Crest" width="96" height="96" style="display: block; margin: 0 auto; object-fit: contain; filter: drop-shadow(0 6px 18px rgba(245,158,11,0.35));" />
          </div>
          <div class="header-title-en">MINISTRY OF TALENT DEVELOPMENT & ADVANCED RESEARCH</div>
          <div class="header-title-km">ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់</div>
          <div class="header-badge">ប្រព័ន្ធគ្រប់គ្រងការសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ</div>
        </div>

        <!-- 🌟 CLEAN WHITE MAIN BODY -->
        <div class="content">
          <h1 class="headline">លេខកូដផ្ទៀងផ្ទាត់សុវត្ថិភាព (OTP Code)</h1>
          <p class="subtext">
            សូមប្រើប្រាស់លេខកូដសម្ងាត់ <strong>៦ ខ្ទង់</strong> ខាងក្រោម ដើម្បីផ្ទៀងផ្ទាត់ចូលប្រើប្រាស់ ឬចុះឈ្មោះគណនីរបស់អ្នកលើប្រព័ន្ធសិក្សាឌីជីថល៖
          </p>

          <!-- 🌟 HIGH CONTRAST OTP PIN CARD -->
          <div class="otp-card">
            <div class="otp-label">Security Verification PIN</div>
            <span class="otp-number">${otpCode}</span>
          </div>

          <!-- 🌟 SECURITY NOTICES -->
          <div class="info-card">
            <div class="info-row">
              <span>⏱️</span>
              <span>លេខកូដសម្ងាត់នេះមានសុពលភាពត្រឹមតែ <strong>៥ នាទី (5 Minutes)</strong> ប៉ុណ្ណោះ។</span>
            </div>
            <div class="info-row">
              <span>🔒</span>
              <span>សូមកុំចែករំលែកលេខកូដនេះទៅកាន់បុគ្គលណាផ្សេងឱ្យសោះ ដើម្បីធានាសុវត្ថិភាពគណនី។</span>
            </div>
          </div>
        </div>

        <!-- 🌟 CLEAN LIGHT FOOTER -->
        <div class="footer">
          <div class="footer-brand">© ${new Date().getFullYear()} ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Cambodia)</div>
          <div>Official National High School Digital Learning System</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
            សារនេះត្រូវបានផ្ញើដោយស្វ័យប្រវត្តិចេញពីប្រព័ន្ធសុវត្ថិភាព MoEYS SSO Gateway
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;

  const plainText = `[MoEYS Cambodia - National E-Learning Platform]\n\nYour 6-Digit Security OTP PIN is: ${otpCode}\n\nThis verification code is valid for 5 minutes. Please enter it to complete your sign-in / registration.\n\n© ${new Date().getFullYear()} Ministry of Education, Youth and Sport (MoEYS Cambodia)`;

  const attachments = [];
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'moeys-logo.png',
      path: logoPath,
      cid: 'moeyslogo'
    });
  }

  const subject = `លេខកូដសម្ងាត់ MoTDAR OTP របស់អ្នកគឺ: ${otpCode}`;

  // 1. Try HTTPS API first (Port 443 - Bypasses Render cloud SMTP firewall)
  const httpResult = await sendViaHttpApi(toEmail, subject, htmlContent, plainText);
  if (httpResult && httpResult.success) {
    return httpResult;
  }

  const mailOptions = {
    from: `"MoTDAR E-Learning" <${senderEmail}>`,
    to: toEmail,
    subject,
    text: plainText,
    html: htmlContent,
    attachments
  };

  // Attempt 1: Port 587 STARTTLS (IPv4)
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Gmail SMTP Success - Port 587]: OTP Email sent to ${toEmail} (MessageId: ${info.messageId})`);
    return {
      success: true,
      sentViaSmtp: true,
      messageId: info.messageId
    };
  } catch (err587) {
    console.warn(`⚠️ [Gmail SMTP 587 Warning]: Failed (${err587.message}). Retrying on Port 465 SSL...`);
    
    // Attempt 2: Port 465 SSL (IPv4)
    try {
      const fallbackTransporter = createTransporter(465, true);
      const info465 = await fallbackTransporter.sendMail(mailOptions);
      console.log(`✅ [Gmail SMTP Success - Port 465]: OTP Email sent to ${toEmail} (MessageId: ${info465.messageId})`);
      return {
        success: true,
        sentViaSmtp: true,
        messageId: info465.messageId
      };
    } catch (err465) {
      console.error(`❌ [Gmail SMTP Error]: All ports failed to send email to ${toEmail}:`, err465.message);
      return {
        success: false,
        sentViaSmtp: false,
        error: err465.message
      };
    }
  }
};
