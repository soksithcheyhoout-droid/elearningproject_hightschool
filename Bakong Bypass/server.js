import http from "node:http";
import fs from "node:fs";
import { chromium } from "playwright-core";

const PORT = process.env.PORT || 3000;
const SITE = "https://api-bakong.nbc.gov.kh/";
const SITE_KEY = "6Ldjf3YtAAAAAKaxeqLGdxRkNW06Wq5ws6nPnPbG";

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

let browser = null;
let page = null;
let ready = false;

function resolveExecutablePath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const termuxPaths = [
    "/data/data/com.termux/files/usr/bin/chromium-browser",
    "/data/data/com.termux/files/usr/bin/chromium",
  ];
  for (const p of termuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

import chromiumPkg from "@sparticuz/chromium";

async function buildLaunchOptions() {
  const opts = { headless: true, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-zygote"] };

  if (process.env.CHROMIUM_PATH) {
    opts.executablePath = process.env.CHROMIUM_PATH;
  } else if (process.platform === 'linux') {
    try {
      opts.executablePath = await chromiumPkg.executablePath();
    } catch (e) {
      opts.executablePath = "/usr/bin/chromium";
    }
  } else {
    opts.channel = "chrome";
  }

  const proxyUrl = process.env.PROXY_URL;
  if (proxyUrl) {
    opts.proxy = { server: proxyUrl };
  } else if (process.env.KH_PROXY === "true") {
    const idx = Math.floor(Math.random() * KH_PROXIES.length);
    opts.proxy = { server: KH_PROXIES[idx] };
  }

  return opts;
}

async function init() {
  console.log("Launching browser...");
  const t0 = Date.now();
  const launchOpts = await buildLaunchOptions();
  browser = await chromium.launch(launchOpts);
  page = await browser.newPage();
  await page.goto(SITE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);
  await getToken().catch(() => {});
  ready = true;
  console.log(`Ready in ${Date.now() - t0} ms`);
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
    await page.waitForFunction(() => window.grecaptcha !== undefined, null, { timeout: 30000 });
    token = await getToken();
  }
  const result = await postFromPage(md5, token);
  if (result.parsed && result.parsed.errorCode === 18 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1500));
    return checkMd5(md5, attempt + 1);
  }
  return result;
}

let lastJob = Promise.resolve();
function enqueue(fn) {
  const run = lastJob.then(fn, fn);
  lastJob = run.catch(() => {});
  return run;
}

const initPromise = init();

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
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
    return sendJson(res, 200, {
      service: "bakong-md5-api",
      status: ready ? "ready" : "warming_up",
      usage: "GET /api/bakong/unofficial/md5=<32-char-md5>",
    });
  }

  const m = url.match(/^\/api\/bakong\/unofficial\/md5=([0-9a-fA-F]{32})(?:\?.*)?$/);
  if (!m) {
    return sendJson(res, 404, { error: "Not found", expected: "/api/bakong/unofficial/md5=<md5>" });
  }

  const md5 = m[1];
  enqueue(async () => {
    try {
      await initPromise;
      const result = await checkMd5(md5);
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
      sendJson(res, 500, { error: err.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
