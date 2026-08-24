import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initSecurityProtection } from './utils/securityProtection.js';

// Activate Anti-Inspect & Asset Protection
initSecurityProtection();

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('khmer_elearn_student');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-kantumruy text-center">
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-400 flex items-center justify-center text-3xl mx-auto">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-white">មានបញ្ហាបច្ចេកទេសតិចតួច</h2>
            <p className="text-xs text-slate-400">
              ប្រព័ន្ធបានរកឃើញកំហុសបណ្តោះអាសន្ន។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីដំណើរការឡើងវិញជាប្រក្រតី។
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-rose-300 bg-rose-950/40 p-2.5 rounded-xl text-left overflow-auto max-h-28 border border-rose-500/20 font-mono">
                {this.state.error?.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
            >
              ដំណើរការប្រព័ន្ធឡើងវិញ (Reload App)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Clean up third-party injected extension widgets on initial load
if (typeof window !== 'undefined') {
  const cleanExtensionNodes = () => {
    try {
      const selectors = [
        '#sider-root', '#monica-root', '#maxai-root', '#chatgpt-sidebar-root',
        '[id*="sider-"]', '[id*="monica-"]', '[id*="maxai-"]',
        '[class*="sider-"]', '[class*="monica-"]', '[class*="maxai-"]',
        '[id*="floating-ai"]', '[class*="floating-ai"]',
        'div[data-extension-id]'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el && el.id !== 'root' && !document.getElementById('root')?.contains(el)) {
            el.remove();
          }
        });
      });
    } catch (e) {}
  };

  window.addEventListener('DOMContentLoaded', cleanExtensionNodes, { once: true });
  setTimeout(cleanExtensionNodes, 1000);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
