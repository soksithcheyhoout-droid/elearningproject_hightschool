/**
 * MoTDAR National E-Learning Platform - Advanced Anti-Inspect & DevTools Protection
 * Features:
 * - Real-time Device Detection (Mobile Phone, Laptop, Desktop PC, Tablet, OS & Browser)
 * - Royal Executive Cybersecurity Alert Card with Golden Shield & Live Telemetry
 * - Right-Click & Developer Shortcut Protection (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
 * - Debugger Trap & Console Auto-Purge
 */

// ══════════════════════════════════════════════════════════════════════
// 1. INTELLIGENT DEVICE DETECTION ENGINE
// ══════════════════════════════════════════════════════════════════════
export function detectUserDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      type: 'Desktop',
      typeKh: '🖥️ កុំព្យូទ័រលើតុ (Desktop PC)',
      os: 'Unknown OS',
      browser: 'Browser',
      resolution: 'Unknown',
      icon: '🖥️'
    };
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const width = window.innerWidth || window.screen.width || 1920;
  const height = window.innerHeight || window.screen.height || 1080;
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // 1. Detect OS
  let os = 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (Apple)';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS (Apple)';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows/i.test(ua)) os = 'Windows';

  // 2. Detect Browser
  let browser = 'Chrome';
  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Brave/i.test(ua)) browser = 'Brave';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';

  // 3. Detect Device Form-Factor
  let type = 'Desktop';
  let typeKh = '🖥️ កុំព្យូទ័រលើតុ (Desktop PC)';
  let icon = '🖥️';

  const isMobileUa = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTabletUa = /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Silk/i.test(ua);

  if (isMobileUa || (width < 640 && hasTouch)) {
    type = 'Phone';
    typeKh = '📱 ទូរស័ព្ទដៃ (Smartphone)';
    icon = '📱';
  } else if (isTabletUa || (width >= 640 && width <= 1024 && hasTouch)) {
    type = 'Tablet';
    typeKh = '📟 ថេប្លេត (Tablet)';
    icon = '📟';
  } else {
    // Laptop vs Desktop heuristic: laptops have battery API, touch screen, or typical display resolutions
    const isBatteryCapable = 'getBattery' in navigator;
    const isLaptopResolution = width <= 1600 && height <= 1000;
    if (hasTouch || isLaptopResolution || isBatteryCapable) {
      type = 'Laptop';
      typeKh = '💻 កុំព្យូទ័រយួរដៃ (Laptop)';
      icon = '💻';
    } else {
      type = 'Desktop';
      typeKh = '🖥️ កុំព្យូទ័រលើតុ (Desktop PC)';
      icon = '🖥️';
    }
  }

  return {
    type,
    typeKh,
    os,
    browser,
    resolution: `${width}×${height}`,
    icon
  };
}

// ══════════════════════════════════════════════════════════════════════
// 2. ROYAL EXECUTIVE SECURITY NOTIFICATION CARD
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

    // Sound effect / Haptic pulse if supported
    if (navigator.vibrate) {
      try { navigator.vibrate([40, 30, 40]); } catch (e) {}
    }

    const currentTime = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    container.innerHTML = `
      <div id="motdar-sec-card" style="
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 30, 0.98) 100%);
        border: 1.5px solid rgba(255, 215, 0, 0.55);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        padding: 16px 18px 14px 18px;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        color: #fff;
        pointer-events: auto;
        transform: translateY(30px) scale(0.95);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      ">
        {/* Subtle Ambient Gold Glow */}
        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%); pointer-events: none;"></div>

        {/* ── HEADER ROW ── */}
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; border-bottom: 1px solid rgba(255, 215, 0, 0.2); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            {/* National Seal Badge */}
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 12px;
              background: rgba(255, 215, 0, 0.15);
              border: 1px solid #ffd700;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
              flex-shrink: 0;
            ">
              <span style="font-size: 18px;">🛡️</span>
            </div>
            <div>
              <div style="font-family: 'Moul', serif; font-size: 12px; color: #ffd700; letter-spacing: 0.5px; line-height: 1.3;">
                ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR)
              </div>
              <div style="font-size: 10px; color: #94a3b8; font-weight: 600; letter-spacing: 0.3px;">
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
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.background='rgba(239, 68, 68, 0.3)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.color='#cbd5e1';">
            ✕
          </button>
        </div>

        {/* ── SECURITY ACTION BODY ── */}
        <div style="margin-bottom: 10px;">
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;">
            <span style="color: #ef4444;">🔒</span> ${actionName || 'មុខងារត្រូវបានបិទការពារសុវត្ថិភាព'}
          </div>
          <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5;">
            ${reasonDetail || 'ដើម្បីការពារកម្មសិទ្ធិបញ្ញា និងវិញ្ញាសាប្រឡងជាតិ ការព្យាយាម Inspect ត្រូវបានចាក់សោរ។'}
          </div>
        </div>

        {/* ── DETECTED USER TELEMETRY & DEVICE PILL ── */}
        <div style="
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 215, 0, 0.25);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
            <span style="color: #94a3b8; font-weight: 600;">📱 ឧបករណ៍សម្គាល់ ៖</span>
            <span style="color: #38bdf8; font-weight: 700;">${device.typeKh}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #cbd5e1;">
            <span>🌐 ប្រព័ន្ធ / កម្មវិធី ៖</span>
            <span style="color: #a78bfa; font-weight: 600;">${device.os} • ${device.browser}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; color: #64748b;">
            <span>⏱️ ពេលវេលាត្រួតពិនិត្យ ៖</span>
            <span style="color: #e2e8f0; font-family: monospace;">${currentTime} (SSL/TLS 256-bit)</span>
          </div>
        </div>

        {/* ── DISMISS PROGRESS BAR ── */}
        <div style="width: 100%; height: 2.5px; background: rgba(255, 255, 255, 0.1); border-radius: 99px; overflow: hidden;">
          <div id="motdar-sec-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #ffd700, #f59e0b); transition: width 0.1s linear;"></div>
        </div>
      </div>
    `;

    // Trigger smooth in animation
    const card = document.getElementById('motdar-sec-card');
    const closeBtn = document.getElementById('motdar-sec-close');
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
        card.style.transform = 'translateY(25px) scale(0.95)';
      }
      if (cardDismissTimer) clearTimeout(cardDismissTimer);
      if (progressInterval) clearInterval(progressInterval);
    };

    if (closeBtn) closeBtn.onclick = closeAlert;

    // Auto-dismiss countdown with live progress bar
    if (cardDismissTimer) clearTimeout(cardDismissTimer);
    if (progressInterval) clearInterval(progressInterval);

    const totalDuration = 4500;
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
    // Allow normal typing / selection in inputs and textareas
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
    showExecutiveSecurityAlert(
      'ការចុច Mouse ស្ដាំត្រូវបានចាក់សោរ!',
      'ប្រព័ន្ធបានបិទផ្ទាំង Context Menu ដើម្បីការពារសុវត្ថិភាពកូដ និងធនធានសិក្សា។'
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

  // 4. Debugger Protection (Freezes execution if DevTools is opened via browser settings)
  const applyDebuggerTrap = () => {
    try {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        console.clear();
        console.log(
          '%c🛡️ ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់ (MoTDAR)\n⚠️ ការព្រមាន ៖ ប្រព័ន្ធរកឃើញការព្យាយាម Inspect កូដ! សកម្មភាពត្រូវបានកត់ត្រាសុវត្ថិភាព។',
          'color: #ffd700; background: #0b1329; font-size: 15px; font-weight: bold; padding: 12px; border: 2px solid #ffd700; border-radius: 10px;'
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
