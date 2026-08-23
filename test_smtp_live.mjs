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
    console.log('Testing Gmail SMTP connection...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully!');
    
    const info = await transporter.sendMail({
      from: `"MoTDAR E-Learning" <${user}>`,
      to: user,
      subject: 'Test MoTDAR OTP Delivery',
      text: 'Your OTP code is: 123456'
    });
    console.log('✅ Email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending mail:', err);
  }
}

test();
