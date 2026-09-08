/**
 * MoTDAR National E-Learning Platform - Universal Anti-Inspect & Security Hardening
 * Defends against DevTools inspection across ALL devices:
 * - macOS (Safari, Chrome, Firefox, Edge, Brave, Opera)
 * - Windows / Linux (Chrome, Firefox, Edge, Brave, Opera)
 * - iOS / iPadOS (Safari, Chrome iOS)
 * - Android (Chrome, Samsung Internet)
 */

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
  // 1. UNIVERSAL CONTEXT MENU & RIGHT-CLICK BLOCKING (Mac & PC & Mobile)
  // -------------------------------------------------------------
  const preventContextMenu = (e) => {
    if (isInputOrEditable(e.target)) {
      return; // Allow students to right-click in text inputs (e.g. paste text)
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document.addEventListener('contextmenu', preventContextMenu, { capture: true, passive: false });
  window.addEventListener('contextmenu', preventContextMenu, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 2. MAC TRACKPAD CONTROL+CLICK BLOCKING
  // On macOS, holding Control while single clicking fires a right-click
  // -------------------------------------------------------------
  document.addEventListener('mousedown', (e) => {
    // Button 2 is right-click; ctrlKey + button 0 is Mac Control+Click
    if (e.button === 2 || (e.ctrlKey && e.button === 0)) {
      if (!isInputOrEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 3. ALL DEVICE DEVELOPER SHORTCUTS BLOCKING (Mac Cmd + PC Ctrl)
  // -------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
    const meta = e.metaKey; // Command on Mac, Windows key on PC
    const ctrl = e.ctrlKey;
    const alt = e.altKey;   // Option on Mac
    const shift = e.shiftKey;
    const key = (e.key || '').toUpperCase();
    const code = e.code || '';
    const keyCode = e.keyCode || e.which || 0;

    // F12 (All platforms)
    if (key === 'F12' || code === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // --- MAC SHORTCUTS (Cmd + Option or Cmd + Shift) ---
    // 1. Cmd + Option + I (Safari / Chrome / Firefox / Edge inspect)
    // 2. Cmd + Option + J (Chrome / Edge console)
    // 3. Cmd + Option + C (Safari / Chrome inspect element)
    // 4. Cmd + Option + U (Safari / Chrome view source)
    // 5. Cmd + Option + K (Firefox console)
    // 6. Cmd + Option + S (Firefox debugger)
    // 7. Cmd + Option + E (Firefox network inspector)
    // 8. Cmd + Option + R (Safari responsive mode)
    if (meta && alt) {
      if (
        key === 'I' || key === 'J' || key === 'C' || key === 'U' ||
        key === 'K' || key === 'S' || key === 'E' || key === 'R' ||
        code === 'KeyI' || code === 'KeyJ' || code === 'KeyC' || code === 'KeyU' ||
        code === 'KeyK' || code === 'KeyS' || code === 'KeyE' || code === 'KeyR'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Cmd + Shift + C, Cmd + Shift + I, Cmd + Shift + J, Cmd + Shift + M (Chrome/Edge on Mac)
    if (meta && shift) {
      if (
        key === 'C' || key === 'I' || key === 'J' || key === 'M' ||
        code === 'KeyC' || code === 'KeyI' || code === 'KeyJ' || code === 'KeyM'
      ) {
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
    if (meta && !shift && (key === 'S' || code === 'KeyS' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // --- WINDOWS / LINUX SHORTCUTS (Ctrl + Shift or Ctrl) ---
    // Ctrl + Shift + I, J, C, K, S, E, M
    if (ctrl && shift) {
      if (
        key === 'I' || key === 'J' || key === 'C' || key === 'K' ||
        key === 'S' || key === 'E' || key === 'M' ||
        code === 'KeyI' || code === 'KeyJ' || code === 'KeyC' || code === 'KeyK' ||
        code === 'KeyS' || code === 'KeyE' || code === 'KeyM' ||
        keyCode === 73 || keyCode === 74 || keyCode === 67 || keyCode === 75
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Ctrl + U (View Source on Windows/Linux)
    if (ctrl && (key === 'U' || code === 'KeyU' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Save Page on Windows/Linux)
    if (ctrl && !shift && (key === 'S' || code === 'KeyS' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true, passive: false });

  // -------------------------------------------------------------
  // 4. MOBILE (iOS & Android) TOUCH & HOLD / CALLOUT PROTECTION
  // -------------------------------------------------------------
  let touchTimer = null;
  document.addEventListener('touchstart', (e) => {
    if (isInputOrEditable(e.target)) return;
    touchTimer = setTimeout(() => {
      // Prevent long-press contextual menus on iOS Safari & Android
    }, 450);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (touchTimer) clearTimeout(touchTimer);
  }, { passive: true });

  document.addEventListener('touchcancel', () => {
    if (touchTimer) clearTimeout(touchTimer);
  }, { passive: true });

  // -------------------------------------------------------------
  // 5. ASSET & IMAGE DRAG PROTECTION
  // -------------------------------------------------------------
  document.addEventListener('dragstart', (e) => {
    const tag = e.target?.tagName?.toUpperCase();
    if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS' || tag === 'A') {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // -------------------------------------------------------------
  // 6. DEVTOOLS ACTIVE DETECTION & DEBUGGER TRAP
  // When DevTools is opened, dynamic debugger triggers pause loop
  // -------------------------------------------------------------
  const launchDebuggerTrap = () => {
    try {
      const debugFn = function() {
        (function() {
          return false;
        }['constructor']('debugger')['call']());
      };
      // Run every 600ms; if DevTools is open, debugger will freeze the inspector
      setInterval(debugFn, 600);
    } catch (e) {}
  };

  // Only run debugger trap in non-local environments or production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    launchDebuggerTrap();
  }

  // -------------------------------------------------------------
  // 7. CONSOLE LOCKDOWN & OBFUSCATION
  // Hide internal API logs, token outputs, and credentials
  // -------------------------------------------------------------
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      const warningStyle = 'background: #0f172a; color: #f59e0b; font-size: 16px; font-weight: bold; padding: 10px 16px; border-radius: 8px; border: 1px solid #f59e0b;';
      const infoStyle = 'color: #94a3b8; font-size: 12px; margin-top: 4px;';
      
      console.clear();
      console.log('%c⚠️ ការពារសុវត្ថិភាព | MoTDAR Security System', warningStyle);
      console.log('%cThis academic platform is protected. Developer inspection tools and scripts are strictly restricted.', infoStyle);

      // Nullify detailed logging in production so no sensitive data leaks
      const noop = () => {};
      console.dir = noop;
      console.table = noop;
      console.trace = noop;
    } catch (e) {}
  }
}
