import disableDevtool from 'disable-devtool';

/**
 * MoTDAR National E-Learning Platform - Maximum Anti-Inspect & DevTools Shield
 * Absolute blocking of inspection across ALL devices:
 * - macOS (Safari, Chrome, Firefox, Edge, Brave, Opera)
 * - Windows & Linux (Chrome, Firefox, Edge, Brave, Opera)
 * - iOS & iPadOS (Safari, Chrome iOS, WebKit)
 * - Android (Chrome, Samsung Internet)
 */

// Helper to reliably detect genuine mobile and tablet devices
// Differentiates real phones from Chrome/Edge DevTools Responsive Emulation Mode
export const isRealMobileOrTablet = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  const platform = (navigator.platform || '').toLowerCase();

  // Desktop indicators (Windows, Mac desktop, Linux desktop)
  const isWindows = platform.includes('win') || ua.includes('windows');
  const isLinuxDesktop = platform.includes('linux x86_64') || (platform.includes('linux') && !ua.includes('android'));
  const isMacDesktop = platform.includes('mac') && !navigator.maxTouchPoints;

  // Desktop OS is NEVER a real mobile or tablet!
  if (isWindows || isLinuxDesktop || isMacDesktop) {
    return false;
  }

  // Large physical monitor (screen width/height > 1200) indicates desktop PC with emulation
  if (window.screen && (window.screen.width > 1200 || window.screen.height > 1200)) {
    return false;
  }

  // Desktop browser window outerWidth vs shrunk inner viewport (Device Mode emulation signature)
  if (window.outerWidth && window.innerWidth && (window.outerWidth - window.innerWidth > 120)) {
    return false;
  }

  // Genuine mobile user-agents
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|silk/i.test(ua);
  const isIPad = /ipad/i.test(ua) || (platform.includes('mac') && Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 1));

  // On real mobile devices, window.outerWidth is either 0 or approximately matches window.innerWidth (diff <= 30)
  const hasMatchingDimensions = !window.outerWidth || Math.abs(window.outerWidth - window.innerWidth) <= 30;

  return Boolean((isMobileUA || isIPad) && hasMatchingDimensions);
};

// Export legacy name for backward compatibility
export const isMobileOrTabletDevice = isRealMobileOrTablet;

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
          សូមបិទ Developer Tools ឬ Web Inspector ជាបន្ទាន់។ ប្រព័ន្ធនឹងបិទទំព័រដោយស្វ័យប្រវត្តិប្រសិនបើរំលោភបំពាន។
        </p>
        <div style="padding: 10px 20px; background: rgba(15, 23, 42, 0.8); border-radius: 12px; border: 1px solid #ef4444; font-size: 13px; color: #fbbf24; font-weight: 600;">
          ⚠️ Developer Tools Detected • Session Terminating Automatically
        </div>
      `;
      document.body.appendChild(lockOverlay);
    }
    return lockOverlay;
  };

  let redirectTimer = null;

  const triggerDebuggerFreeze = () => {
    try {
      (function() {
        return false;
      }['constructor']('debugger')['call']());
    } catch (e) {}
  };

  const setDevToolsLocked = (isLocked) => {
    // If real mobile or tablet device, NEVER lock screen
    if (isRealMobileOrTablet()) {
      isLocked = false;
    }

    const overlay = getOrCreateLockOverlay();
    const rootEl = document.getElementById('root');

    if (isLocked) {
      document.documentElement.classList.add('devtools-locked');
      overlay.style.display = 'flex';
      if (rootEl) {
        rootEl.style.display = 'none';
        rootEl.style.filter = 'blur(40px)';
      }

      // Immediate debugger trap execution
      triggerDebuggerFreeze();

      // Auto-terminate session if DevTools remains open for > 1.8s
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isTestingSecurity = window.location.search.includes('test_security=1');

      if ((!isLocalhost || isTestingSecurity) && !redirectTimer) {
        redirectTimer = setTimeout(() => {
          if (document.documentElement.classList.contains('devtools-locked')) {
            try {
              window.close();
            } catch (e) {}
            window.location.replace('about:blank');
          }
        }, 1800);
      }
    } else {
      document.documentElement.classList.remove('devtools-locked');
      overlay.style.display = 'none';
      if (rootEl) {
        rootEl.style.display = '';
        rootEl.style.filter = 'none';
      }
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
      }
    }
  };

  // -------------------------------------------------------------
  // 6.1 PRIMARY ENGINE: DISABLE-DEVTOOL (Catches Chrome 3-Dot Menu, Undocked, Console Getters)
  // -------------------------------------------------------------
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isTestingSecurity = typeof window !== 'undefined' && window.location.search.includes('test_security=1');

  if (typeof window !== 'undefined' && (!isLocalhost || isTestingSecurity)) {
    try {
      disableDevtool({
        ondevtoolopen() {
          setDevToolsLocked(true);
        },
        ondevtoolclose() {
          setDevToolsLocked(false);
        },
        interval: 200,
        disableMenu: true,
        clearLog: true,
        detectors: 'all',
        disableIframeParents: true
      });
    } catch (e) {
      console.warn('DisableDevtool init fallback', e);
    }
  }

  // -------------------------------------------------------------
  // 6.2 SECONDARY ENGINE: MULTI-VECTOR DETECTION (Dimensions, Emulation, Timing)
  // -------------------------------------------------------------
  let consecutiveHits = 0;

  const checkDevToolsSecondary = () => {
    if (isRealMobileOrTablet()) {
      consecutiveHits = 0;
      setDevToolsLocked(false);
      return;
    }

    if (isLocalhost && !isTestingSecurity) {
      consecutiveHits = 0;
      setDevToolsLocked(false);
      return;
    }

    // Vector 1: Desktop Window Docked DevTools (Right, Left, Bottom)
    // Normal maximized Windows 11 Chrome: wDiff is 0-16px, hDiff is ~160-220px.
    // Docked DevTools on bottom adds >= 250px (total diff > 320px).
    // Docked DevTools on right/left takes >= 280px.
    const widthDiff = window.outerWidth - window.innerWidth > 280;
    const heightDiff = window.outerHeight - window.innerHeight > 320;

    // Vector 2: Chrome DevTools Responsive Device Mode Emulation Toolbar Check
    const emulationDetected = Boolean(
      window.outerWidth &&
      window.innerWidth &&
      window.outerWidth > 900 &&
      window.innerWidth <= 600 &&
      (window.outerWidth - window.innerWidth > 350)
    );

    if (widthDiff || heightDiff || emulationDetected) {
      consecutiveHits++;
      if (consecutiveHits >= 2) {
        setDevToolsLocked(true);
      }
    } else {
      consecutiveHits = 0;
      // Unlock only if disableDevtool also agrees it is not open
      if (!disableDevtool?.isDevToolOpened?.()) {
        setDevToolsLocked(false);
      }
    }
  };

  // Run secondary DevTools detection check every 350ms
  setInterval(checkDevToolsSecondary, 350);

  // -------------------------------------------------------------
  // 7. BACKGROUND DEBUGGER FREEZE TRAP (Desktop production only)
  // Freezes DevTools execution ONLY WHEN DevTools is detected and locked
  // -------------------------------------------------------------
  const launchDebuggerTrap = () => {
    if (isRealMobileOrTablet()) return;
    if (isLocalhost && !isTestingSecurity) return;

    try {
      const debugFn = function() {
        if (document.documentElement.classList.contains('devtools-locked')) {
          (function() {
            return false;
          }['constructor']('debugger')['call']());
        }
      };
      setInterval(debugFn, 150);
    } catch (e) {}
  };
  launchDebuggerTrap();

  // -------------------------------------------------------------
  // 8. CONSOLE SECURITY & OBFUSCATION (Production only)
  // -------------------------------------------------------------
  if (typeof window !== 'undefined' && (!isLocalhost || isTestingSecurity)) {
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
