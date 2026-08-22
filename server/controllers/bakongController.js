import crypto from 'node:crypto';

class KHQRGenerator {
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
          crc = crc << 1;
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

    qr += this.formatTag(this.TAGS.PAYLOAD_FORMAT, "01");
    const poim = isStatic || !amount || String(amount) === "0" ? "11" : "12";
    qr += this.formatTag(this.TAGS.POINT_OF_INITIATION, poim);

    const accountInfo = {
      [this.SUB_TAGS.BAKONG_ACCOUNT]: accountId
    };
    qr += this.formatSubTag(this.TAGS.MERCHANT_INFO_INDIVIDUAL, accountInfo);
    qr += this.formatTag(this.TAGS.MERCHANT_CATEGORY, "5999");

    const currencyCode = currency.toUpperCase() === "USD" ? "840" : "116";
    qr += this.formatTag(this.TAGS.CURRENCY, currencyCode);

    const formattedAmount = currency.toUpperCase() === 'KHR' 
      ? String(Math.round(Number(amount))) 
      : Number(amount).toFixed(2);

    if (amount && String(amount) !== "0") {
      qr += this.formatTag(this.TAGS.AMOUNT, formattedAmount);
    }

    qr += this.formatTag(this.TAGS.COUNTRY, "KH");
    qr += this.formatTag(this.TAGS.MERCHANT_NAME, merchantName);
    qr += this.formatTag(this.TAGS.MERCHANT_CITY, merchantCity);

    const additionalData = {};
    if (billNumber) additionalData[this.SUB_TAGS.BILL_NUMBER] = billNumber;
    if (mobileNumber) additionalData[this.SUB_TAGS.MOBILE] = mobileNumber;
    if (storeLabel) additionalData[this.SUB_TAGS.STORE_LABEL] = storeLabel;
    if (terminalLabel) additionalData[this.SUB_TAGS.TERMINAL] = terminalLabel;
    
    if (Object.keys(additionalData).length > 0) {
      qr += this.formatSubTag(this.TAGS.ADDITIONAL_DATA, additionalData);
    }

    const nowMs = Date.now();
    const timestampData = { "00": nowMs.toString() };
    if (!isStatic && amount && String(amount) !== "0") {
      const expMs = nowMs + (30 * 86400 * 1000);
      timestampData["01"] = expMs.toString();
    }
    qr += this.formatSubTag(this.TAGS.TIMESTAMP, timestampData);

    qr += this.TAGS.CRC + "04";
    const crc = this.calculateCRC16(qr);
    qr += crc;

    return qr;
  }
}

const generator = new KHQRGenerator();

/**
 * Generate official Bakong KHQR String & MD5
 * POST /api/bakong/generate-khqr
 */
export const generateBakongKhqr = (req, res) => {
  try {
    const {
      bakongAccount = 'hut_soksitchey1@aclb',
      merchantName = 'chey_dev',
      merchantCity = 'Phnom Penh',
      currency = 'USD',
      amount = 1.00,
      billNumber = '',
      storeLabel = 'chey_dev'
    } = req.body || {};

    const formattedAmount = currency.toUpperCase() === 'KHR'
      ? String(Math.round(Number(amount)))
      : Number(amount).toFixed(2);

    const qrString = generator.generate({
      accountId: bakongAccount,
      merchantName,
      merchantCity,
      amount: formattedAmount,
      currency: currency.toUpperCase(),
      billNumber: billNumber || ('TXN' + Date.now()),
      storeLabel,
      terminalLabel: 'POS-01'
    });

    const md5 = crypto.createHash('md5').update(qrString).digest('hex');

    res.json({
      success: true,
      qrString,
      md5,
      amount: formattedAmount,
      currency: currency.toUpperCase(),
      bakongAccount,
      merchantName,
      merchantCity
    });
  } catch (error) {
    console.error('[Bakong KHQR Generation Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Proxy check transaction status from local Bakong Bypass server or direct NBC
 * GET /api/bakong/check/:md5
 */
export const checkBakongStatus = async (req, res) => {
  const { md5 } = req.params;
  if (!md5 || !/^[0-9a-fA-F]{32}$/.test(md5)) {
    return res.status(400).json({ error: 'Invalid 32-character MD5 hash' });
  }

  // Forward to local Playwright bypass server (port 3000)
  const bypassUrl = `http://localhost:3000/api/bakong/unofficial/md5=${md5}`;

  try {
    const fetchRes = await fetch(bypassUrl, { signal: AbortSignal.timeout(15000) });
    const data = await fetchRes.json();
    return res.json(data);
  } catch (err) {
    return res.json({ status: 'PENDING', message: 'Waiting for payment confirmation...' });
  }
};
