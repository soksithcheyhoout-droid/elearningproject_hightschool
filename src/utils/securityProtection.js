/**
 * MoTDAR National E-Learning Platform - Maximum Anti-Inspect & DevTools Shield
 * Absolute blocking of inspection across ALL devices:
 * - macOS (Safari, Chrome, Firefox, Edge, Brave, Opera)
 * - Windows & Linux (Chrome, Firefox, Edge, Brave, Opera)
 * - iOS & iPadOS (Safari, Chrome iOS, WebKit)
 * - Android (Chrome, Samsung Internet)
 */

// Helper to reliably detect mobile and tablet devices
export const isMobileOrTabletDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();

  // 1. Mobile & tablet user agent keywords (iPhone, iPad, Android, etc.)
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|silk|fennec|tablet/i.test(ua);
  if (isMobileUA) return true;

  // 2. iPadOS Safari (reports as Macintosh with touch points)
  const isIPadOS = /macintosh/i.test(ua) && Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  if (isIPadOS) return true;

  // 3. Touch device checks (coarse pointer, touch screen)
  const hasTouchCapability = Boolean(
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    'ontouchstart' in window ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
    (window.matchMedia && window.matchMedia('(hover: none)').matches)
  );

  // If touch is enabled and screen width/height is in mobile/tablet range (<= 1024)
  if (hasTouchCapability && (window.innerWidth <= 1024 || window.innerHeight <= 1024 || (window.screen && window.screen.width <= 1024))) {
    return true;
  }

  return false;
};

export function initSecurityProtection() {
  if (typeof window === 'undefined') return;

  const isInputOrEditable = (target) => {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toUpperCase() : '';
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      target.isContentEditable ||
      target.getAttribute?.('contenteditable') === 'true'
    );
  };

  // -------------------------------------------------------------
  // 1. UNIVERSAL CONTEXT MENU & RIGHT-CLICK SHIELD (Mac, PC, Mobile)
  // -------------------------------------------------------------
  const blockContextMenu = (e) => {
    if (isInputOrEditable(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  window.addEventListener('contextmenu', blockContextMenu, { capture: true, passive: false });
  document.addEventListener('contextmenu', blockContextMenu, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 2. MAC TRACKPAD CONTROL+CLICK & AUXCLICK BLOCKING
  // -------------------------------------------------------------
  const blockMouseClicks = (e) => {
    // button 2 = right-click, button 1 = middle-click
    // ctrlKey + button 0 = Mac trackpad Control+Click
    if (e.button === 2 || e.button === 1 || (e.ctrlKey && e.button === 0)) {
      if (!isInputOrEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  };

  window.addEventListener('mousedown', blockMouseClicks, { capture: true, passive: false });
  window.addEventListener('mouseup', blockMouseClicks, { capture: true, passive: false });
  window.addEventListener('auxclick', blockMouseClicks, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 3. SELECTION & CLIPBOARD SHIELD OUTSIDE INPUTS
  // -------------------------------------------------------------
  document.addEventListener('selectstart', (e) => {
    if (!isInputOrEditable(e.target)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true, passive: false });

  document.addEventListener('copy', (e) => {
    if (!isInputOrEditable(e.target)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true, passive: false });

  document.addEventListener('cut', (e) => {
    if (!isInputOrEditable(e.target)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 4. ALL SHORTCUT KEYS BLOCKING (Mac Cmd + PC Ctrl + Function Keys)
  // -------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    const meta = e.metaKey; // Command on Mac
    const ctrl = e.ctrlKey; // Control on Windows/Mac
    const alt = e.altKey;   // Option on Mac / Alt on PC
    const shift = e.shiftKey;
    const key = (e.key || '').toUpperCase();
    const code = e.code || '';
    const keyCode = e.keyCode || e.which || 0;

    // F12 key (Chrome, Edge, Firefox DevTools)
    if (key === 'F12' || code === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // F1 through F11 (often bound to browser dev / source features)
    if (/^F([1-9]|1[0-1])$/.test(key) || /^F([1-9]|1[0-1])$/.test(code)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // --- MAC SHORTCUTS (Cmd + Option + [Key]) ---
    if (meta && alt) {
      // I: Web Inspector, J: Console, C: Inspect Element, U: View Source,
      // K: Firefox Console, S: Debugger, E: Network, R: Responsive Mode, Z: Web Inspector
      if (/^[IJCUKSERZV]$/.test(key) || /^Key[IJCUKSERZV]$/.test(code)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // --- MAC SHORTCUTS (Cmd + Shift + [Key]) ---
    if (meta && shift) {
      // C: Inspect Element, I: DevTools, J: Console, M: Device Mode, P: Command Palette
      if (/^[CIJMP]$/.test(key) || /^Key[CIJMP]$/.test(code)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Cmd + U (View Source on Mac)
    if (meta && (key === 'U' || code === 'KeyU' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Cmd + S (Save Page on Mac)
    if (meta && (key === 'S' || code === 'KeyS' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Cmd + P (Print / Save PDF on Mac)
    if (meta && (key === 'P' || code === 'KeyP' || keyCode === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Cmd + A (Select all DOM on Mac - allow only in inputs)
    if (meta && (key === 'A' || code === 'KeyA' || keyCode === 65)) {
      if (!isInputOrEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // --- WINDOWS / LINUX SHORTCUTS (Ctrl + Shift + [Key]) ---
    if (ctrl && shift) {
      // I: DevTools, J: Console, C: Inspect, K: Firefox Console, S: Debugger, E: Network, M: Device, P: Palette
      if (/^[IJCKS EMP]$/.test(key) || /^Key[IJCKS EMP]$/.test(code) || keyCode === 73 || keyCode === 74 || keyCode === 67) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + U (View Source)
    if (ctrl && (key === 'U' || code === 'KeyU' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Save Page)
    if (ctrl && (key === 'S' || code === 'KeyS' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + P (Print)
    if (ctrl && (key === 'P' || code === 'KeyP' || keyCode === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + A (Select all - allow only in inputs)
    if (ctrl && (key === 'A' || code === 'KeyA' || keyCode === 65)) {
      if (!isInputOrEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 5. ASSET & MEDIA DRAG PROTECTION
  // -------------------------------------------------------------
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 6. DEVTOOLS ACTIVE DETECTION & SECURITY LOCK SCREEN
  // -------------------------------------------------------------
  let lockOverlay = null;

  const getOrCreateLockOverlay = () => {
    if (lockOverlay && document.body.contains(lockOverlay)) return lockOverlay;
    lockOverlay = document.getElementById('security-devtools-lock');
    if (!lockOverlay) {
      lockOverlay = document.createElement('div');
      lockOverlay.id = 'security-devtools-lock';
      lockOverlay.style.cssText = `
        display: none;
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: #090d16;
        color: #ffffff;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: 'Kantumruy Pro', system-ui, -apple-system, sans-serif;
        padding: 24px;
        box-sizing: border-box;
      `;
      lockOverlay.innerHTML = `
        <div style="width: 80px; height: 80px; border-radius: 24px; background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 38px; margin-bottom: 24px; box-shadow: 0 0 40px rgba(239, 68, 68, 0.3);">
          🛡️
        </div>
        <h1 style="font-size: 26px; font-weight: 800; color: #f87171; margin: 0 0 12px 0; letter-spacing: -0.5px;">
          ប្រព័ន្ធការពារសុវត្ថិភាពខ្ពស់ | SECURITY LOCK ACTIVE
        </h1>
        <p style="font-size: 14px; color: #94a3b8; max-width: 520px; line-height: 1.7; margin: 0 0 20px 0;">
          ការពិនិត្យកូដ (Inspect Element) ឬ Developer Tools ត្រូវបានហាមឃាត់ដាច់ខាតនៅលើប្រព័ន្ធនេះ។<br/>
          សូមបិទ Developer Tools ឬ Web Inspector ជាបន្ទាន់ដើម្បីបន្តការប្រើប្រាស់។
        </p>
        <div style="padding: 10px 20px; background: rgba(15, 23, 42, 0.8); border-radius: 12px; border: 1px solid #334155; font-size: 13px; color: #fbbf24; font-weight: 600;">
          ⚠️ Developer Tools Detected • Inspection is Prohibited
        </div>
      `;
      document.body.appendChild(lockOverlay);
    }
    return lockOverlay;
  };

  const setDevToolsLocked = (isLocked) => {
    // If mobile or tablet device, NEVER lock screen
    if (isMobileOrTabletDevice()) {
      isLocked = false;
    }

    const overlay = getOrCreateLockOverlay();
    const rootEl = document.getElementById('root');
    if (isLocked) {
      overlay.style.display = 'flex';
      if (rootEl) rootEl.style.filter = 'blur(20px)';
    } else {
      overlay.style.display = 'none';
      if (rootEl) rootEl.style.filter = 'none';
    }
  };

  // Continuous DevTools Dimension & Timing Detector (Desktop only)
  let consecutiveHits = 0;

  const checkDevTools = () => {
    // 1. Mobile & tablet devices NEVER have docked DevTools panes.
    // Their window.outerHeight vs innerHeight differences are caused by Safari/Chrome URL bars and bottom toolbars.
    if (isMobileOrTabletDevice()) {
      consecutiveHits = 0;
      setDevToolsLocked(false);
      return;
    }

    // Do not lock during local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      consecutiveHits = 0;
      setDevToolsLocked(false);
      return;
    }

    // 2. Desktop Window Threshold Check
    // Exclude cases where browser is zoomed in (devicePixelRatio changed)
    const dpr = window.devicePixelRatio || 1;
    const isStandardZoom = Math.abs(dpr - 1) < 0.2; // ~100% zoom (0.8x - 1.2x)

    let dockedDetected = false;
    if (isStandardZoom) {
      // Normal desktop browser chrome (tabs + address bar + borders) is ~80-120px.
      // Docked DevTools takes at least 220px.
      const widthDiff = window.outerWidth - window.innerWidth > 220;
      const heightDiff = window.outerHeight - window.innerHeight > 220;
      if (widthDiff || heightDiff) {
        dockedDetected = true;
      }
    }

    // 3. Timing check with debugger
    let timingDetected = false;
    const start = performance.now();
    try {
      (function() {
        return false;
      }['constructor']('debugger')['call']());
    } catch (e) {}
    const end = performance.now();

    if (end - start > 150) {
      timingDetected = true;
    }

    if (dockedDetected || timingDetected) {
      consecutiveHits++;
      // Require at least 2 consecutive positive detections to prevent false positives from transient CPU hiccups
      if (consecutiveHits >= 2) {
        setDevToolsLocked(true);
      }
    } else {
      consecutiveHits = 0;
      setDevToolsLocked(false);
    }
  };

  // Run DevTools detection check every 600ms
  setInterval(checkDevTools, 600);

  // -------------------------------------------------------------
  // 7. BACKGROUND DEBUGGER FREEZE TRAP (Desktop production only)
  // Freezes DevTools execution if someone keeps it open on desktop
  // -------------------------------------------------------------
  const launchDebuggerTrap = () => {
    // Never run freeze trap on mobile/tablet devices (prevents battery drain & UI stutter)
    if (isMobileOrTabletDevice()) return;

    // Do not run in local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

    try {
      const debugFn = function() {
        (function() {
          return false;
        }['constructor']('debugger')['call']());
      };
      setInterval(debugFn, 1000);
    } catch (e) {}
  };
  launchDebuggerTrap();

  // -------------------------------------------------------------
  // 8. CONSOLE SECURITY & OBFUSCATION (Production only)
  // -------------------------------------------------------------
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    try {
      const warningStyle = 'background: #0f172a; color: #ef4444; font-size: 16px; font-weight: bold; padding: 10px 16px; border-radius: 8px; border: 1px solid #ef4444;';
      const infoStyle = 'color: #94a3b8; font-size: 12px; margin-top: 4px;';

      console.clear();
      console.log('%c⚠️ ប្រព័ន្ធសុវត្ថិភាព | MoTDAR Security System', warningStyle);
      console.log('%cThis academic platform is protected. Developer inspection tools and unauthorized scripts are restricted.', infoStyle);

      // Nullify detailed object inspection logs in production
      const noop = () => {};
      console.dir = noop;
      console.dirxml = noop;
      console.table = noop;
      console.trace = noop;
      console.debug = noop;
    } catch (e) {}
  }
}
