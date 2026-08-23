import nodemailer from 'nodemailer';
import dns from 'dns';

const user = 'soksithcheyhoout@gmail.com';
const pass = 'hkxlhzduvlkgbeqg';

const ipv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: false }, (err, address, family) => {
    console.log(`[DNS Resolve] ${hostname} -> IPv4: ${address} (family: ${family})`);
    callback(err, address, family);
  });
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  lookup: ipv4Lookup,
  auth: {
    user,
    pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Testing SMTP connection with strict IPv4...');
    await transporter.verify();
    console.log('✅ Connected via IPv4 successfully!');
    const info = await transporter.sendMail({
      from: `"MoTDAR E-Learning" <${user}>`,
      to: user,
      subject: 'Test Strict IPv4 OTP',
      text: 'OTP code is: 999888'
    });
    console.log('✅ Email sent! ID:', info.messageId);
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

run();
