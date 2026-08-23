/**
 * MoTDAR National E-Learning Platform - Silent Anti-Inspect & DevTools Protection
 * Completely silent, zero popups or alerts.
 * Blocks Right-Click, F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Debugger, and Console.
 */

export function initSecurityProtection() {
  if (typeof window === 'undefined') return;

  // 1. Silently Block Context Menu (Right Click)
  document.addEventListener('contextmenu', (e) => {
    const target = e.target;
    // Allow right click ONLY inside text inputs and textareas for normal student typing
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { capture: true });

  // 2. Silently Block Developer Shortcut Keys
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + I or Cmd + Option + I (Inspect)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + J or Cmd + Option + J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + C or Cmd + Option + C (Element Picker)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U or Cmd + Option + U (View Page Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
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

  // 3. Silently Prevent Dragging Media/Images
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 4. Debugger Protection (Freezes execution if DevTools is opened via browser menu)
  const applyDebuggerTrap = () => {
    try {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        console.clear();
      }
    } catch (err) {}
  };

  // Run periodic debugger check in production
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(applyDebuggerTrap, 1000);
  }

  // 5. Console Auto-Purge
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(() => {
      try {
        console.clear();
      } catch (e) {}
    }, 4000);
  }
}
