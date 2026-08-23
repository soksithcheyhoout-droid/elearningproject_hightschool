/**
 * MoTDAR National E-Learning Platform - Advanced Anti-Inspect & DevTools Protection
 * Protects platform assets, examination materials, and source code against inspection.
 */

export function initSecurityProtection() {
  if (typeof window === 'undefined') return;

  // 1. Block Context Menu (Right Click)
  document.addEventListener('contextmenu', (e) => {
    // Allow right click ONLY inside input / textarea if needed for pasting
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return; // allow normal typing
    }
    e.preventDefault();
    showSecurityWarning('🔒 ការចុច Mouse ស្ដាំត្រូវបានបិទការពារសុវត្ថិភាព!');
    return false;
  }, { capture: true });

  // 2. Block DevTools Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityWarning('🔒 មុខងារ Inspect Element (F12) ត្រូវបានបិទការពារ!');
      return false;
    }

    // Ctrl + Shift + I (Inspect) or Cmd + Option + I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityWarning('🔒 មុខងារ Inspect ត្រូវបានបិទការពារ!');
      return false;
    }

    // Ctrl + Shift + J (Console) or Cmd + Option + J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityWarning('🔒 ផ្ទាំង Console ត្រូវបានបិទការពារ!');
      return false;
    }

    // Ctrl + Shift + C (Element Picker) or Cmd + Option + C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityWarning('🔒 មុខងារ Inspect Selector ត្រូវបានបិទការពារ!');
      return false;
    }

    // Ctrl + U (View Page Source) or Cmd + Option + U
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityWarning('🔒 ការមើលកូដទំព័រ (View Source) ត្រូវបានបិទការពារ!');
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

  // 4. Debugger Protection (Freezes execution if DevTools is opened via browser menu)
  const applyDebuggerTrap = () => {
    try {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        console.clear();
        console.log(
          '%c⚠️ ការព្រមានសុវត្ថិភាពក្រសួង MoTDAR: ការព្យាយាម Inspect កូដត្រូវបានបិទការពារសុវត្ថិភាពជាតិ!',
          'color: #ffd700; background: #0f172a; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 8px;'
        );
      }
    } catch (err) {}
  };

  // Run periodic debugger check in production
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(applyDebuggerTrap, 1000);
  }

  // 5. Clear Console Output
  if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
    setInterval(() => {
      try {
        console.clear();
      } catch (e) {}
    }, 5000);
  }
}

let toastTimer = null;
function showSecurityWarning(message) {
  try {
    let toast = document.getElementById('motdar-security-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'motdar-security-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(15, 23, 42, 0.95);
        color: #ffd700;
        border: 1px solid rgba(255, 215, 0, 0.4);
        box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(255,215,0,0.2);
        padding: 10px 20px;
        border-radius: 9999px;
        font-family: 'Kantumruy Pro', sans-serif;
        font-size: 13px;
        font-weight: bold;
        z-index: 99999999;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  } catch (e) {}
}
