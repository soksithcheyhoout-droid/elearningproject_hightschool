async function testNbc() {
  try {
    const md5 = 'a84eb838b9bbfe58d927d3faebf3eb7e';
    console.log('Testing direct NBC API...');
    const resp = await fetch('https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ md5 })
    });
    console.log('NBC status:', resp.status);
    const data = await resp.text();
    console.log('NBC data:', data);
  } catch (e) {
    console.error('NBC error:', e.message);
  }
}

testNbc();
