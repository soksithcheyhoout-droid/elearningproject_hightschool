import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import fs from 'fs';

// Create Gmail SMTP transporter
const createTransporter = () => {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'soksithcheyhoout@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'hkxlhzduvlkgbeqg').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

/**
 * Send 6-Digit OTP Security Code via Gmail
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
            <img src="cid:moeyslogo" alt="MoEYS National Crest" width="96" height="96" style="display: block; margin: 0 auto; object-fit: contain; filter: drop-shadow(0 6px 18px rgba(245,158,11,0.35));" />
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

  try {
    const info = await transporter.sendMail({
      from: `"MoTDAR E-Learning" <${senderEmail}>`,
      to: toEmail,
      subject: `លេខកូដសម្ងាត់ MoTDAR OTP របស់អ្នកគឺ: ${otpCode}`,
      text: plainText,
      html: htmlContent,
      attachments
    });

    console.log(`✅ [Gmail SMTP Success]: OTP Email sent to ${toEmail} (MessageId: ${info.messageId})`);
    return {
      success: true,
      sentViaSmtp: true,
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`❌ [Gmail SMTP Error]: Failed to send email to ${toEmail}:`, err.message);
    return {
      success: false,
      sentViaSmtp: false,
      error: err.message
    };
  }
};
