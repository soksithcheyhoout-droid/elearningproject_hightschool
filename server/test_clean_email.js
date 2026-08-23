import nodemailer from 'nodemailer';

const user = 'soksithcheyhoout@gmail.com';
const pass = 'hkxlhzduvlkgbeqg';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass
  }
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"MoTDAR E-Learning" <${user}>`,
      to: user,
      subject: `លេខកូដសម្ងាត់ MoTDAR OTP របស់អ្នកគឺ: 789456`,
      text: `លេខកូដផ្ទៀងផ្ទាត់សុវត្ថិភាព MoTDAR របស់អ្នកគឺ៖ 789456\nសុពលភាព ៥ នាទី។`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
            <h2 style="color: #002b49; text-align: center;">ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR)</h2>
            <p style="text-align: center; color: #475569;">លេខកូដផ្ទៀងផ្ទាត់សុវត្ថិភាពរបស់អ្នកគឺ៖</p>
            <div style="background: #002244; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; border-radius: 8px; margin: 20px 0;">
              789456
            </div>
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">សុពលភាពត្រឹមតែ ៥ នាទីប៉ុណ្ណោះ។</p>
          </div>
        </div>
      `
    });
    console.log('✅ Clean transactional email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending clean email:', err);
  }
}

test();
