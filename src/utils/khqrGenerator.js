/**
 * Official Bakong KHQR Generator & MD5 Check Utility
 * Merchant Account: hut_soksitchey1@aclb
 * Based on NBC Bakong Bypass Specification
 */

// Pure JS MD5 Implementation (Zero external dependency)
function md5Cycle(x, k) {
  let a = x[0], b = x[1], c = x[2], d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

export function md5(s) {
  const txt = unescape(encodeURIComponent(s));
  const n = txt.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) {
    md5Cycle(state, md5Blks(txt.substring(i - 64, i)));
  }
  const tail = txt.substring(i - 64);
  const tailBlks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let j = 0; j < tail.length; j++) {
    tailBlks[j >> 2] |= tail.charCodeAt(j) << ((j % 4) << 3);
  }
  tailBlks[tail.length >> 2] |= 0x80 << ((tail.length % 4) << 3);
  if (tail.length > 55) {
    md5Cycle(state, tailBlks);
    for (let j = 0; j < 16; j++) tailBlks[j] = 0;
  }
  tailBlks[14] = n * 8;
  md5Cycle(state, tailBlks);
  return state.map(val => {
    let hex = (val >>> 0).toString(16).padStart(8, '0');
    return hex.match(/../g).reverse().join('');
  }).join('');
}

function md5Blks(s) {
  const blks = [];
  for (let i = 0; i < 64; i += 4) {
    blks[i >> 2] = s.charCodeAt(i)
      + (s.charCodeAt(i + 1) << 8)
      + (s.charCodeAt(i + 2) << 16)
      + (s.charCodeAt(i + 3) << 24);
  }
  return blks;
}

// Real KHQR generator based on NBC specifications
export class KHQRGenerator {
  constructor() {
    this.TAGS = {
      PAYLOAD_FORMAT: "00",
      POINT_OF_INITIATION: "01",
      MERCHANT_INFO_INDIVIDUAL: "29",
      MERCHANT_INFO_MERCHANT: "30",
      MERCHANT_CATEGORY: "52",
      CURRENCY: "53",
      AMOUNT: "54",
      COUNTRY: "58",
      MERCHANT_NAME: "59",
      MERCHANT_CITY: "60",
      ADDITIONAL_DATA: "62",
      TIMESTAMP: "99",
      CRC: "63"
    };
    
    this.SUB_TAGS = {
      BAKONG_ACCOUNT: "00",
      MERCHANT_ID: "01",
      ACQUIRING_BANK: "02",
      BILL_NUMBER: "01",
      MOBILE: "02",
      STORE_LABEL: "03",
      TERMINAL: "07"
    };
  }

  formatTag(tag, value) {
    const length = value.length.toString().padStart(2, "0");
    return `${tag}${length}${value}`;
  }

  formatSubTag(parentTag, subData) {
    let result = "";
    for (const [subTag, value] of Object.entries(subData)) {
      if (value) {
        result += this.formatTag(subTag, value);
      }
    }
    const length = result.length.toString().padStart(2, "0");
    return `${parentTag}${length}${result}`;
  }

  calculateCRC16(data) {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ polynomial) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
  }

  generate(params) {
    const {
      accountId = 'hut_soksitchey1@aclb',
      merchantName = 'chey_dev',
      merchantCity = 'Phnom Penh',
      amount,
      currency = 'USD',
      billNumber,
      mobileNumber,
      storeLabel = 'chey_dev',
      terminalLabel = 'POS-01',
      isStatic = false
    } = params;

    let qr = "";

    // Payload Format Indicator
    qr += this.formatTag(this.TAGS.PAYLOAD_FORMAT, "01");

    // Point of Initiation Method
    const poim = isStatic || !amount || String(amount) === "0" ? "11" : "12";
    qr += this.formatTag(this.TAGS.POINT_OF_INITIATION, poim);

    // Merchant Account Information (Individual)
    const accountInfo = {
      [this.SUB_TAGS.BAKONG_ACCOUNT]: accountId
    };
    qr += this.formatSubTag(this.TAGS.MERCHANT_INFO_INDIVIDUAL, accountInfo);

    // Merchant Category Code
    qr += this.formatTag(this.TAGS.MERCHANT_CATEGORY, "5999");

    // Transaction Currency
    const currencyCode = currency.toUpperCase() === "USD" ? "840" : "116";
    qr += this.formatTag(this.TAGS.CURRENCY, currencyCode);

    // Transaction Amount
    const formattedAmount = currency.toUpperCase() === 'KHR' 
      ? String(Math.round(Number(amount))) 
      : Number(amount).toFixed(2);

    if (amount && String(amount) !== "0") {
      qr += this.formatTag(this.TAGS.AMOUNT, formattedAmount);
    }

    // Country Code
    qr += this.formatTag(this.TAGS.COUNTRY, "KH");

    // Merchant Name
    qr += this.formatTag(this.TAGS.MERCHANT_NAME, merchantName);

    // Merchant City
    qr += this.formatTag(this.TAGS.MERCHANT_CITY, merchantCity);

    // Additional Data
    const additionalData = {};
    if (billNumber) additionalData[this.SUB_TAGS.BILL_NUMBER] = billNumber;
    if (mobileNumber) additionalData[this.SUB_TAGS.MOBILE] = mobileNumber;
    if (storeLabel) additionalData[this.SUB_TAGS.STORE_LABEL] = storeLabel;
    if (terminalLabel) additionalData[this.SUB_TAGS.TERMINAL] = terminalLabel;
    
    if (Object.keys(additionalData).length > 0) {
      qr += this.formatSubTag(this.TAGS.ADDITIONAL_DATA, additionalData);
    }

    // Timestamp (Tag 99: creation timestamp '00' and expiration timestamp '01' in milliseconds)
    const nowMs = Date.now();
    const timestampData = { "00": nowMs.toString() };
    if (!isStatic && amount && String(amount) !== "0") {
      // Set expiration to 30 days in the future
      const expMs = nowMs + (30 * 86400 * 1000);
      timestampData["01"] = expMs.toString();
    }
    qr += this.formatSubTag(this.TAGS.TIMESTAMP, timestampData);

    // CRC Placeholder
    qr += this.TAGS.CRC + "04";

    // Calculate and append CRC
    const crc = this.calculateCRC16(qr);
    qr += crc;

    return qr;
  }
}

const defaultGenerator = new KHQRGenerator();

/**
 * Generate Real KHQR String using NBC Bypass Format
 */
export function generateKhqrString({
  bakongAccount = 'hut_soksitchey1@aclb',
  merchantName = 'chey_dev',
  merchantCity = 'Phnom Penh',
  currency = 'USD', // 'USD' | 'KHR'
  amount = 1.00,
  billNumber = '',
  storeLabel = 'chey_dev'
}) {
  const formattedAmount = currency.toUpperCase() === 'KHR' 
    ? String(Math.round(Number(amount))) 
    : Number(amount).toFixed(2);

  const qrString = defaultGenerator.generate({
    accountId: bakongAccount,
    merchantName,
    merchantCity,
    amount: formattedAmount,
    currency: currency.toUpperCase(),
    billNumber: billNumber || ('TXN' + Date.now()),
    storeLabel,
    terminalLabel: 'POS-01'
  });

  const khqrMd5 = md5(qrString);

  return {
    qrString,
    md5: khqrMd5,
    amount: formattedAmount,
    currency: currency.toUpperCase(),
    bakongAccount,
    merchantName
  };
}

/**
 * Check transaction status against Bakong API
 */
export async function checkBakongTransactionStatus(md5Hash) {
  if (!md5Hash) return { status: 'PENDING' };

  try {
    const response = await fetch(`/api/bakong/check/${md5Hash}`, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' } 
    });
    if (response.ok) {
      const data = await response.json();
      if (data.responseCode === 0 || data.errorCode === 0 || data.data?.status === 'SUCCESS' || data.status === 'SUCCESS') {
        return { status: 'SUCCESS', data };
      }
      if (data.errorCode === 18) {
        return { status: 'PENDING', message: 'Waiting for payment...' };
      }
    }
  } catch (err) {
    // Ignore network hiccups silently
  }

  return { status: 'PENDING' };
}

export function formatTlv(tag, val) {
  const str = String(val);
  const len = String(str.length).padStart(2, '0');
  return `${tag}${len}${str}`;
}

export async function renderKhqrCanvas() {
  return null;
}

