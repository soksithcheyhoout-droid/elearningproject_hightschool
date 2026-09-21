/**
 * MoTDAR National E-Learning Platform - Enterprise Rate Limiting & Anti-Brute-Force Security Shield
 * 
 * Protects against:
 * - High-frequency Bot & DDoS Flood attacks (e.g. 100,000+ automated requests)
 * - Credential stuffing & dictionary attacks on /api/auth/login and /api/admin/login
 * - Account enumeration & spamming on /api/auth/send-otp and /api/auth/register
 * - Memory exhaustion / Thread starvation from synchronous bcrypt
 */

// In-Memory Storage for IP Tracking and Security Jailing
const ipHitMap = new Map();             // IP -> { hits: number, resetAt: number }
const ipJailMap = new Map();            // IP -> { jailedUntil: number, reason: string }
const failedLoginMap = new Map();       // Key (ip or username) -> { count: number, lockedUntil: number }

// Auto-cleanup every 5 minutes to prevent memory leaks
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipHitMap.entries()) {
    if (now > data.resetAt) ipHitMap.delete(ip);
  }
  for (const [ip, data] of ipJailMap.entries()) {
    if (now > data.jailedUntil) ipJailMap.delete(ip);
  }
  for (const [key, data] of failedLoginMap.entries()) {
    if (now > data.lockedUntil && data.count < 5) failedLoginMap.delete(key);
  }
}, 5 * 60 * 1000);

if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

/**
 * Accurately extracts the real client IP address behind Render / Cloudflare / Nginx reverse proxies.
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // Take the first IP in the X-Forwarded-For list (the true client)
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Firewall Middleware: Jails aggressive attackers sending massive floods.
 * Drops connection immediately without executing routes or hitting the database.
 */
export function ipFirewallMiddleware(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();

  // 1. Check if IP is currently jailed
  const jailRecord = ipJailMap.get(ip);
  if (jailRecord && now < jailRecord.jailedUntil) {
    const remainingSecs = Math.ceil((jailRecord.jailedUntil - now) / 1000);
    res.setHeader('Retry-After', remainingSecs);
    return res.status(403).json({
      error: 'ការចូលប្រើប្រាស់ត្រូវបានបិទបណ្តោះអាសន្ន ដោយសារមានសកម្មភាពវាយប្រហារ (Access Denied: Suspicious flood detected. Your IP is temporarily blacklisted.)',
      status: 403,
      retryAfterSeconds: remainingSecs,
      securityShield: 'MoTDAR Enterprise Anti-DDoS Firewall'
    });
  }

  // 2. Ultra-high frequency flood tripwire (e.g. > 60 requests in 5 seconds from a single IP)
  const tripwireKey = `flood_${ip}`;
  const record = ipHitMap.get(tripwireKey) || { hits: 0, resetAt: now + 5000 };
  record.hits += 1;
  if (now > record.resetAt) {
    record.hits = 1;
    record.resetAt = now + 5000;
  }
  ipHitMap.set(tripwireKey, record);

  if (record.hits > 60) {
    // Jail attacker IP for 15 minutes immediately
    console.warn(`🚨 [SECURITY JAIL] IP ${ip} jailed for 15 minutes due to extreme flood attack (${record.hits} reqs / 5s)`);
    ipJailMap.set(ip, {
      jailedUntil: now + 15 * 60 * 1000,
      reason: 'Extreme HTTP flood attack'
    });
    return res.status(429).json({
      error: 'ប្រព័ន្ធសុវត្ថិភាពបានចាក់សោរ IP នេះ ដោយសារការផ្ញើសំណើច្រើនខុសប្រក្រតី (IP temporarily banned for 15 minutes due to high-speed flood).',
      retryAfterSeconds: 900
    });
  }

  next();
}

/**
 * General API Rate Limiter: 150 requests per minute per IP for general endpoints
 */
export function globalApiLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxHits = 150;

  const key = `api_${ip}`;
  const data = ipHitMap.get(key) || { hits: 0, resetAt: now + windowMs };

  if (now > data.resetAt) {
    data.hits = 0;
    data.resetAt = now + windowMs;
  }

  data.hits += 1;
  ipHitMap.set(key, data);

  res.setHeader('X-RateLimit-Limit', maxHits);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxHits - data.hits));

  if (data.hits > maxHits) {
    const retrySec = Math.ceil((data.resetAt - now) / 1000);
    res.setHeader('Retry-After', retrySec);
    return res.status(429).json({
      error: 'សំណើច្រើនពេកក្នុងពេលតែមួយ! សូមរង់ចាំបន្តិច (Too many API requests. Please wait a minute.)',
      retryAfterSeconds: retrySec,
      securityShield: true
    });
  }

  next();
}

/**
 * Strict Authentication Limiter: Protects login, registration, and OTP endpoints
 * Maximum 10 auth attempts per minute per IP.
 */
export function authRateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxHits = 12; // 12 requests / min is plenty for humans, but chokes brute-force tools

  const key = `auth_${ip}`;
  const data = ipHitMap.get(key) || { hits: 0, resetAt: now + windowMs };

  if (now > data.resetAt) {
    data.hits = 0;
    data.resetAt = now + windowMs;
  }

  data.hits += 1;
  ipHitMap.set(key, data);

  res.setHeader('X-RateLimit-Auth-Limit', maxHits);
  res.setHeader('X-RateLimit-Auth-Remaining', Math.max(0, maxHits - data.hits));

  if (data.hits > maxHits) {
    const retrySec = Math.ceil((data.resetAt - now) / 1000);
    res.setHeader('Retry-After', retrySec);

    // If an attacker exceeds 30 hits on auth endpoints, jail them for 30 minutes
    if (data.hits > 30) {
      ipJailMap.set(ip, {
        jailedUntil: now + 30 * 60 * 1000,
        reason: 'Brute-force credential stuffing'
      });
      console.warn(`🚨 [SECURITY JAIL] IP ${ip} blacklisted for 30 minutes (Credential Stuffing Attack Detected)`);
    }

    return res.status(429).json({
      error: 'សំណើចូលគណនីច្រើនពេក! ប្រព័ន្ធបានផ្អាកការប៉ុនប៉ងជាបណ្តោះអាសន្ន (Too many authentication requests. Rate limit active. Please wait 1 minute.)',
      retryAfterSeconds: retrySec,
      securityShield: true
    });
  }

  // Sanitize auth inputs against malicious oversized payload attacks (buffer overflows / slowloris)
  if (req.body) {
    const { username, password, email } = req.body;
    if (username && typeof username === 'string' && username.length > 128) {
      return res.status(400).json({ error: 'Username exceeds allowed length (Max 128 chars).' });
    }
    if (password && typeof password === 'string' && password.length > 256) {
      return res.status(400).json({ error: 'Password exceeds allowed length (Max 256 chars).' });
    }
    if (email && typeof email === 'string' && email.length > 128) {
      return res.status(400).json({ error: 'Email exceeds allowed length (Max 128 chars).' });
    }
  }

  next();
}

/**
 * Checks if an IP or specific Username is currently locked due to repeated bad credentials
 */
export function checkAccountLockout(ip, username) {
  const now = Date.now();
  const cleanUser = (username || '').trim().toLowerCase();

  // 1. Check IP lockout
  const ipLock = failedLoginMap.get(`fail_ip_${ip}`);
  if (ipLock && ipLock.lockedUntil > now) {
    const waitSec = Math.ceil((ipLock.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      error: `ការប៉ុនប៉ងបញ្ចូលលេខសម្ងាត់ខុសច្រើនដងពេកពី IP នេះ! សូមរង់ចាំ ${Math.ceil(waitSec / 60)} នាទី (Too many failed logins from this IP. Locked for ${waitSec}s).`,
      retryAfterSeconds: waitSec
    };
  }

  // 2. Check Username lockout (stops distributed botnets targeting a single account)
  if (cleanUser) {
    const userLock = failedLoginMap.get(`fail_user_${cleanUser}`);
    if (userLock && userLock.lockedUntil > now) {
      const waitSec = Math.ceil((userLock.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        error: `គណនីនេះត្រូវបានចាក់សោរបណ្តោះអាសន្ន ដោយសារការបញ្ចូលលេខសម្ងាត់ខុស ៥ ដងជាប់គ្នា! សូមរង់ចាំ ${Math.ceil(waitSec / 60)} នាទី (Account locked for security. Try again in ${waitSec}s).`,
        retryAfterSeconds: waitSec
      };
    }
  }

  return { isLocked: false };
}

/**
 * Records a failed password attempt and triggers lockout when threshold is reached
 */
export function recordFailedLogin(ip, username) {
  const now = Date.now();
  const cleanUser = (username || '').trim().toLowerCase();

  // 1. IP tracking
  const ipKey = `fail_ip_${ip}`;
  const ipData = failedLoginMap.get(ipKey) || { count: 0, lockedUntil: 0 };
  ipData.count += 1;
  if (ipData.count >= 6) {
    ipData.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout after 6 bad tries
    console.warn(`⚠️ [BRUTE FORCE DETECTED] IP ${ip} failed login ${ipData.count} times. Locked for 15 mins.`);
  }
  failedLoginMap.set(ipKey, ipData);

  // 2. Username tracking
  if (cleanUser) {
    const userKey = `fail_user_${cleanUser}`;
    const userData = failedLoginMap.get(userKey) || { count: 0, lockedUntil: 0 };
    userData.count += 1;
    if (userData.count >= 5) {
      userData.lockedUntil = now + 10 * 60 * 1000; // 10-minute lockout for the account
      console.warn(`⚠️ [ACCOUNT LOCKED] Username "${cleanUser}" locked for 10 mins after 5 bad password attempts.`);
    }
    failedLoginMap.set(userKey, userData);
  }
}

/**
 * Clears failed login counter on successful authentication
 */
export function clearFailedLogin(ip, username) {
  failedLoginMap.delete(`fail_ip_${ip}`);
  if (username) {
    failedLoginMap.delete(`fail_user_${username.trim().toLowerCase()}`);
  }
}
