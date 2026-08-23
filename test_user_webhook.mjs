const url = 'https://script.google.com/macros/s/AKfycbxu8QZ0wiuVkWBIoWhjmEoi7-I2LvgdTKWf8mE1tK2odHGKVnifh2wblxEzc7tEeU8S5w/exec';

async function test() {
  try {
    console.log('Sending test email via Google Apps Script...');
    const resp = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        to: 'soksithcheyhoout@gmail.com',
        subject: 'សាកល្បងលេខកូដ MoTDAR OTP ៖ 987654',
        htmlBody: '<div style="font-family: sans-serif; padding: 20px; text-align: center;"><h2 style="color: #0284c7;">ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR)</h2><p>លេខកូដសម្ងាត់ OTP របស់អ្នកគឺ៖</p><h1 style="background: #021833; color: #fff; padding: 15px; border-radius: 10px; letter-spacing: 8px;">987654</h1><p style="color: #64748b;">សុពលភាព ៥ នាទី</p></div>',
        body: 'លេខកូដសម្ងាត់ MoTDAR OTP របស់អ្នកគឺ: 987654'
      })
    });
    const result = await resp.text();
    console.log('✅ Response:', resp.status, result);
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

test();
