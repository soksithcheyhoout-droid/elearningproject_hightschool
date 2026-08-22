import { chromium as playwright } from "playwright-core";
import chromium from "@sparticuz/chromium";

const SITE = "https://api-bakong.nbc.gov.kh/";
const SITE_KEY = "6Ldjf3YtAAAAAKaxeqLGdxRkNW06Wq5ws6nPnPbG";

let browser = null;
let page = null;

async function getBrowser() {
  if (browser && browser.isConnected()) return browser;
  browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  page = await browser.newPage();
  await page.goto(SITE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  await getToken().catch(() => {});
  return browser;
}

async function getToken() {
  return page.evaluate(
    (key) =>
      new Promise((resolve, reject) => {
        if (!window.grecaptcha) return reject(new Error("grecaptcha not loaded"));
        grecaptcha.ready(() => {
          grecaptcha.execute(key, { action: "submit" }).then(resolve, reject);
        });
      }),
    SITE_KEY
  );
}

async function postFromPage(md5, token) {
  return page.evaluate(
    async ({ md5, token }) => {
      const r = await fetch("/local/v1/check_transaction_by_md5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5, recaptchaToken: token }),
      });
      const text = await r.text();
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      return { httpStatus: r.status, raw: text, parsed };
    },
    { md5, token }
  );
}

async function checkMd5(md5, attempt = 0) {
  let token;
  try {
    token = await getToken();
  } catch {
    await page.waitForFunction(() => window.grecaptcha !== undefined, null, { timeout: 15000 });
    token = await getToken();
  }
  const result = await postFromPage(md5, token);
  if (result.parsed && result.parsed.errorCode === 18 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1500));
    return checkMd5(md5, attempt + 1);
  }
  return result;
}

function json(res, status, obj) {
  const body = JSON.stringify(obj, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

export default async function handler(req, res) {
  const url = req.url || "/";

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (url === "/" || url === "/health") {
    return json(res, 200, {
      service: "bakong-md5-api",
      platform: "vercel",
      usage: "GET /api/bakong/unofficial/md5=<32-char-md5>",
    });
  }

  const m = url.match(/^\/api\/bakong\/unofficial\/md5=([0-9a-fA-F]{32})(?:\?.*)?$/);
  if (!m) {
    return json(res, 404, { error: "Not found", expected: "/api/bakong/unofficial/md5=<md5>" });
  }

  try {
    await getBrowser();
    const result = await checkMd5(m[1]);
    const httpStatus = typeof result.httpStatus === "number" ? result.httpStatus : 200;
    const raw = typeof result.raw === "string" ? result.raw : "null";
    res.writeHead(httpStatus, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(raw);
  } catch (err) {
    console.error("Check error:", err.message);
    json(res, 500, { error: err.message });
  }
}
