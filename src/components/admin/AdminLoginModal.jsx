import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  KeyRound,
  Crown
} from 'lucide-react';
import { playSound } from '../../utils/audioEffects';
import api from '../../services/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('soksithcheyhoout@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('សូមបញ្ចូល Email និង Password Admin');
      playSound.wrong();
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    playSound.click();

    try {
      const res = await api.adminLogin(email.trim(), password.trim());
      if (res && res.success && res.admin) {
        playSound.levelUp();
        localStorage.setItem('motdar_admin_session', JSON.stringify(res.admin));
        onLoginSuccess(res.admin);
        onClose();
      } else {
        playSound.wrong();
        setErrorMessage(res?.error || 'Email ឬ Password Admin មិនត្រឹមត្រូវទេ');
      }
    } catch (err) {
      playSound.wrong();
      setErrorMessage('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (adminEmail) => {
    playSound.pop();
    setEmail(adminEmail);
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-kantumruy">
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-amber-300/60 shadow-2xl overflow-hidden relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#002d62] via-[#004785] to-[#005baa] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white/40">
            <ShieldCheck className="w-8 h-8 text-[#002d62]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[10px] font-extrabold uppercase font-cinzel tracking-wider mb-1">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>EXECUTIVE COMMAND CENTER</span>
          </div>

          <h2 className="text-lg font-black text-white font-moul">
            ចូលផ្ទាំងបញ្ជា SUPER ADMIN
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-[#003366] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#005baa]" />
              <span>Email Admin (Gmail / MoTDAR)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="soksithcheyhoout@gmail.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-[#005baa] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-[#003366] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#005baa]" />
              <span>Password Admin</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-[#005baa] focus:bg-white transition-all shadow-inner pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Preset Credentials */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-cinzel">
              QUICK ADMIN ACCESS:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('soksithcheyhoout@gmail.com')}
                className="p-2 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] font-extrabold text-[#005baa] block truncate">
                  👑 soksithcheyhoout
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Gmail SuperAdmin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin@motdar.gov.kh')}
                className="p-2 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] font-extrabold text-amber-700 block truncate">
                  🏛️ MoTDAR Admin
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Ministry Official</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002d62] via-[#004785] to-[#005baa] hover:from-[#001f44] hover:to-[#003d77] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>ចូលផ្ទាំងបញ្ជា (LOGIN SUPER ADMIN)</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
