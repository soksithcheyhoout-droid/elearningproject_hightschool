const KH_PROXIES = [
  "socks5://203.189.153.170:1080",
  "socks5://220.158.234.84:1080",
  "socks5://220.158.232.118:1080",
  "socks5://110.235.240.223:1080",
  "socks5://185.175.229.218:1080",
  "socks5://124.248.191.83:1080",
  "socks5://110.235.247.206:1080",
  "socks5://202.62.55.95:1080",
  "socks5://110.235.240.135:1080",
  "socks5://185.175.229.58:1080",
];

async function checkDirect() {
  try {
    console.log('Testing direct reachability to NBC Bakong website...');
    const resp = await fetch('https://api-bakong.nbc.gov.kh/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });
    console.log('Direct status:', resp.status);
    const text = await resp.text();
    console.log('Direct response length:', text.length, 'Contains grecaptcha:', text.includes('grecaptcha') || text.includes('recaptcha'));
  } catch (e) {
    console.error('Direct failed:', e.message);
  }
}

checkDirect();
