/**
 * MoTDAR National E-Learning Platform - Advanced Anti-Inspect & DevTools Protection
 * Professional, Executive Cybersecurity Alert Card (Strictly Zero Emojis)
 * Includes custom interactive animated wave reflection button linking to Security Policy.
 */

// ══════════════════════════════════════════════════════════════════════
// 1. INTELLIGENT DEVICE DETECTION ENGINE (NO EMOJIS)
// ══════════════════════════════════════════════════════════════════════
export function detectUserDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      type: 'Desktop',
      typeKh: 'កុំព្យូទ័រលើតុ (Desktop PC)',
      os: 'Windows / Standard OS',
      browser: 'Browser',
      resolution: 'Unknown'
    };
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const width = window.innerWidth || window.screen.width || 1920;
  const height = window.innerHeight || window.screen.height || 1080;
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // 1. Detect OS
  let os = 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (Apple)';
  else if (/Android/i.test(ua)) os = 'Android OS';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS (Apple)';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows/i.test(ua)) os = 'Windows';

  // 2. Detect Browser
  let browser = 'Google Chrome';
  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Brave/i.test(ua)) browser = 'Brave';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';

  // 3. Detect Device Form-Factor
  let type = 'Desktop';
  let typeKh = 'កុំព្យូទ័រលើតុ (Desktop PC)';

  const isMobileUa = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTabletUa = /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Silk/i.test(ua);

  if (isMobileUa || (width < 640 && hasTouch)) {
    type = 'Phone';
    typeKh = 'ទូរស័ព្ទដៃ (Smartphone)';
  } else if (isTabletUa || (width >= 640 && width <= 1024 && hasTouch)) {
    type = 'Tablet';
    typeKh = 'ថេប្លេត (Tablet)';
  } else {
    const isBatteryCapable = 'getBattery' in navigator;
    const isLaptopResolution = width <= 1600 && height <= 1000;
    if (hasTouch || isLaptopResolution || isBatteryCapable) {
      type = 'Laptop';
      typeKh = 'កុំព្យូទ័រយួរដៃ (Laptop)';
    } else {
      type = 'Desktop';
      typeKh = 'កុំព្យូទ័រលើតុ (Desktop PC)';
    }
  }

  return {
    type,
    typeKh,
    os,
    browser,
    resolution: `${width}x${height}`
  };
}

// ══════════════════════════════════════════════════════════════════════
// 2. ROYAL EXECUTIVE SECURITY NOTIFICATION CARD WITH WAVE BUTTON
// ══════════════════════════════════════════════════════════════════════
let cardDismissTimer = null;
let progressInterval = null;

export function showExecutiveSecurityAlert(actionName, reasonDetail) {
  try {
    const device = detectUserDevice();
    let container = document.getElementById('motdar-security-portal');

    if (!container) {
      container = document.createElement('div');
      container.id = 'motdar-security-portal';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999999;
        font-family: 'Kantumruy Pro', 'Inter', sans-serif;
        pointer-events: none;
        max-width: 440px;
        width: calc(100vw - 32px);
      `;
      document.body.appendChild(container);
    }

    const currentTime = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    container.innerHTML = `
      <div id="motdar-sec-card" style="
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.99) 100%);
        border: 1.5px solid rgba(255, 215, 0, 0.6);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        padding: 18px 20px 16px 20px;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        color: #fff;
        pointer-events: auto;
        transform: translateY(30px) scale(0.96);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      ">
        {/* Ambient Top Glow */}
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #ffd700, transparent); pointer-events: none;"></div>

        {/* ── HEADER ROW ── */}
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 215, 0, 0.2); padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            {/* SVG Shield Icon (No Emojis) */}
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 10px;
              background: rgba(255, 215, 0, 0.12);
              border: 1px solid rgba(255, 215, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffd700;
              flex-shrink: 0;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div style="font-family: 'Moul', serif; font-size: 12px; color: #ffd700; letter-spacing: 0.3px; line-height: 1.3;">
                ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR)
              </div>
              <div style="font-size: 10px; color: #94a3b8; font-weight: 600; letter-spacing: 0.4px;">
                National Cybersecurity & Asset Shield
              </div>
            </div>
          </div>

          <button id="motdar-sec-close" style="
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #cbd5e1;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          ">
            ✕
          </button>
        </div>

        {/* ── SECURITY ACTION NOTIFICATION ── */}
        <div style="margin-bottom: 12px;">
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #ef4444;"></span>
            ${actionName || 'មុខងារត្រូវបានបិទការពារសុវត្ថិភាព'}
          </div>
          <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5;">
            ${reasonDetail || 'ដើម្បីការពារកម្មសិទ្ធិបញ្ញា និងវិញ្ញាសាប្រឡងជាតិ ការព្យាយាម Inspect ត្រូវបានចាក់សោរ។'}
          </div>
        </div>

        {/* ── DETECTED USER TELEMETRY (NO EMOJIS) ── */}
        <div style="
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 215, 0, 0.22);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 14px;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
            <span style="color: #94a3b8; font-weight: 600;">ឧបករណ៍សម្គាល់ ៖</span>
            <span style="color: #38bdf8; font-weight: 700;">${device.typeKh}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
            <span>ប្រព័ន្ធប្រតិបត្តិការ / Browser ៖</span>
            <span style="color: #a78bfa; font-weight: 600;">${device.os} • ${device.browser}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #64748b;">
            <span>កូដនីយកម្មសុវត្ថិភាព ៖</span>
            <span style="color: #e2e8f0; font-family: monospace;">SSL/TLS 256-bit Active (${currentTime})</span>
          </div>
        </div>

        {/* ── CUSTOM DYNAMIC WAVE REFLECTION BUTTON (DIRECT USER SPECIFICATION) ── */}
        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
          <button
            id="motdar-policy-btn"
            style="-webkit-box-reflect: below 2px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.25));"
            class="px-8 py-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-red-600/40 uppercase font-sans tracking-wider relative overflow-hidden group text-transparent cursor-pointer z-10 after:absolute after:rounded-full after:bg-slate-900 after:h-[84%] after:w-[96%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.2] active:scale-95 transition-all duration-300 w-full"
          >
            Button
            <p
              class="absolute z-40 font-bold bg-gradient-to-r from-amber-300 to-orange-200 bg-clip-text text-transparent top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-full h-full w-full transition-all duration-300 -translate-y-[32%] text-xs tracking-wider flex items-center justify-center"
            >
              អានគោលការណ៍សុវត្ថិភាព
            </p>
            <p
              class="absolute z-40 top-1/2 left-1/2 bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent -translate-x-1/2 translate-y-full h-full w-full transition-all duration-300 group-hover:-translate-y-[32%] text-xs tracking-wider font-extrabold flex items-center justify-center"
            >
              ស្វែងយល់បន្ថែម
            </p>
            <svg
              class="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300 opacity-60"
              viewBox="0 0 2400 800"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sssurf-grad-sec" y2="100%" x2="50%" y1="0%" x1="50%">
                  <stop offset="0%" stop-opacity="1" stop-color="hsl(37, 99%, 67%)"></stop>
                  <stop offset="100%" stop-opacity="1" stop-color="hsl(316, 73%, 52%)"></stop>
                </linearGradient>
              </defs>
              <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad-sec)">
                <path opacity="0.15" transform="matrix(1,0,0,1,0,35)" d="M 0 305.98 Q 227.6 450 600 302.1 Q 1010.7 450 1200 343.3 Q 1379.4 450 1800 320.3 Q 2153.5 450 2400 314.3 L 2400 800 L 0 800 Z"></path>
                <path opacity="0.35" transform="matrix(1,0,0,1,0,70)" d="M 0 305.98 Q 227.6 450 600 302.1 Q 1010.7 450 1200 343.3 Q 1379.4 450 1800 320.3 Q 2153.5 450 2400 314.3 L 2400 800 L 0 800 Z"></path>
                <path opacity="0.65" transform="matrix(1,0,0,1,0,140)" d="M 0 305.98 Q 227.6 450 600 302.1 Q 1010.7 450 1200 343.3 Q 1379.4 450 1800 320.3 Q 2153.5 450 2400 314.3 L 2400 800 L 0 800 Z"></path>
                <path opacity="1" transform="matrix(1,0,0,1,0,245)" d="M 0 305.98 Q 227.6 450 600 302.1 Q 1010.7 450 1200 343.3 Q 1379.4 450 1800 320.3 Q 2153.5 450 2400 314.3 L 2400 800 L 0 800 Z"></path>
              </g>
            </svg>
            <svg
              class="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 fill-red-500 opacity-40"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L0,320Z" fill-opacity="1"></path>
            </svg>
          </button>
        </div>

        {/* ── DISMISS PROGRESS BAR ── */}
        <div style="width: 100%; height: 2px; background: rgba(255, 255, 255, 0.1); border-radius: 99px; overflow: hidden;">
          <div id="motdar-sec-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #ffd700, #f59e0b); transition: width 0.1s linear;"></div>
        </div>
      </div>
    `;

    // Trigger smooth in animation
    const card = document.getElementById('motdar-sec-card');
    const closeBtn = document.getElementById('motdar-sec-close');
    const policyBtn = document.getElementById('motdar-policy-btn');
    const bar = document.getElementById('motdar-sec-bar');

    requestAnimationFrame(() => {
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }
    });

    const closeAlert = () => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(25px) scale(0.96)';
      }
      if (cardDismissTimer) clearTimeout(cardDismissTimer);
      if (progressInterval) clearInterval(progressInterval);
    };

    if (closeBtn) closeBtn.onclick = closeAlert;

    if (policyBtn) {
      policyBtn.onclick = (e) => {
        e.stopPropagation();
        closeAlert();
        // Dispatch event for App to open Security Policy Modal
        window.dispatchEvent(new CustomEvent('open-security-policy'));
      };
    }

    // Auto-dismiss countdown with live progress bar (6 seconds)
    if (cardDismissTimer) clearTimeout(cardDismissTimer);
    if (progressInterval) clearInterval(progressInterval);

    const totalDuration = 6000;
    const startTime = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      if (bar) bar.style.width = `${pct}%`;
      if (pct <= 0) clearInterval(progressInterval);
    }, 50);

    cardDismissTimer = setTimeout(() => {
      closeAlert();
    }, totalDuration);

  } catch (err) {
    console.error('Security alert presentation error:', err);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 3. CORE ANTI-INSPECT EVENT HOOKS
// ══════════════════════════════════════════════════════════════════════
export function initSecurityProtection() {
  if (typeof window === 'undefined') return;

  // 1. Block Context Menu (Right Click)
  document.addEventListener('contextmenu', (e) => {
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
    showExecutiveSecurityAlert(
      'ការចុច Mouse ស្ដាំត្រូវបានចាក់សោរ!',
      'ប្រព័ន្ធបានបិទ Context Menu ដើម្បីការពារសុវត្ថិភាពកូដ និងធនធានសិក្សាជាតិ។'
    );
    return false;
  }, { capture: true });

  // 2. Block DevTools Shortcut Keys
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showExecutiveSecurityAlert(
        'មុខងារ F12 Developer Tools ត្រូវបានចាក់សោរ!',
        'ការបើកផ្ទាំង Developer Console ត្រូវបានហាមឃាត់ជាដាច់ខាត។'
      );
      return false;
    }

    // Ctrl + Shift + I or Cmd + Option + I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      showExecutiveSecurityAlert(
        'មុខងារ Inspect Element ត្រូវបានចាក់សោរ!',
        'ការព្យាយាមពិនិត្យ Source Elements ត្រូវបានទប់ស្កាត់ដោយសុវត្ថិភាព។'
      );
      return false;
    }

    // Ctrl + Shift + J or Cmd + Option + J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      showExecutiveSecurityAlert(
        'ផ្ទាំង Developer Console ត្រូវបានចាក់សោរ!',
        'ការដំណើរការ Script តាមរយៈ Console ត្រូវបានការពារ។'
      );
      return false;
    }

    // Ctrl + Shift + C or Cmd + Option + C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      showExecutiveSecurityAlert(
        'មុខងារ Element Picker ត្រូវបានចាក់សោរ!',
        'ការជ្រើសរើស Element ដើម្បីកែប្រែត្រូវបានទប់ស្កាត់។'
      );
      return false;
    }

    // Ctrl + U or Cmd + Option + U (View Page Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      showExecutiveSecurityAlert(
        'ការមើលកូដទំព័រ (View Source) ត្រូវបានចាក់សោរ!',
        'កូដទំព័រដើមត្រូវបានការពារដោយប្រព័ន្ធកូដនីយកម្មសុវត្ថិភាព។'
      );
      return false;
    }

    // Ctrl + S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true });

  // 3. Prevent Dragging Media/Images
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 4. Debugger Protection
  const applyDebuggerTrap = () => {
    try {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        console.clear();
        console.log(
          '%c[MoTDAR Security] Anti-Inspect protection active. Actions are monitored.',
          'color: #ffd700; background: #0b1329; font-size: 14px; font-weight: bold; padding: 8px; border: 1px solid #ffd700; border-radius: 6px;'
        );
      }
    } catch (err) {}
  };

  // Run periodic debugger check
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(applyDebuggerTrap, 1000);
  }

  // 5. Console Auto-Purge
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(() => {
      try {
        console.clear();
      } catch (e) {}
    }, 5000);
  }
}
