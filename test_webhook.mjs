const url = 'https://script.google.com/macros/s/AKfycbx6JQP9wsprwGIIXsyTFUxs94kTGfxTHOGdHYxsk58szXSbcUIxI7sJFOuGyxybZpaAFQ/exec';

async function testWebhook() {
  try {
    console.log('Sending test email via Google Apps Script HTTPS Webhook...');
    const resp = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        to: 'soksithcheyhoout@gmail.com',
        subject: 'សាកល្បងលេខកូដ MoTDAR OTP (HTTPS Webhook Success)',
        htmlBody: '<h1 style="color: blue;">លេខកូដ OTP របស់អ្នកគឺ៖ 654321</h1><p>ផ្ញើចេញពី Google Apps Script ដោយជោគជ័យ!</p>',
        body: 'លេខកូដ OTP: 654321'
      })
    });
    const text = await resp.text();
    console.log('✅ Response:', resp.status, text);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testWebhook();
