import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Crown, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioEffects';
import api from '../../services/api';

export default function AdminLoginView({ onAdminLoginSuccess, onBackToStudentPortal }) {
  const [email, setEmail] = useState('soksithcheyhoout@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('សូមបញ្ចូល Email និង Password');
      return;
    }

    setLoading(true);
    setError('');
    playSound.click();

    try {
      const res = await api.adminLogin(email.trim(), password.trim());
      if (res && res.success && res.admin) {
        playSound.levelUp();
        localStorage.setItem('motdar_admin_session', JSON.stringify(res.admin));
        onAdminLoginSuccess(res.admin);
      } else {
        playSound.wrong();
        setError(res?.error || 'Email ឬ Password មិនត្រឹមត្រូវទេ');
      }
    } catch (err) {
      playSound.wrong();
      setError('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ប្រព័ន្ធគ្រប់គ្រង Admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001730] flex flex-col justify-between font-kantumruy text-slate-100 selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Gold Ambient Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-blue-500/20 to-amber-500/10 rounded-full blur-[140px]" />
        <img 
          src="/assets/moeys-crest-transparent.png" 
          alt="MoTDAR Crest" 
          className="absolute w-[550px] h-[550px] object-contain opacity-[0.10] filter drop-shadow-[0_20px_60px_rgba(245,158,11,0.35)]" 
        />
      </div>

      {/* Top Bar */}
      <div className="bg-[#001024]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-slate-300 relative z-20">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-400 font-cinzel tracking-wider">
            KINGDOM OF CAMBODIA
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline font-moul text-[11px]">
            ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់ (MoTDAR)
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToStudentPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ត្រឡប់ទៅផ្ទាំងសិស្ស</span>
        </button>
      </div>

      {/* Center Admin Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="max-w-md w-full bg-[#002244]/90 backdrop-blur-2xl rounded-3xl border-2 border-amber-400/50 shadow-[0_25px_70px_rgba(0,10,30,0.85)] p-6 sm:p-8 space-y-6 animate-scaleUp">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-amber-300/40 shadow-xl flex items-center justify-center">
                <img
                  src="/assets/moeys-crest-transparent.png"
                  alt="MoTDAR Crest"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
                <Crown className="w-3.5 h-3.5 text-slate-950" />
              </div>
            </div>

            <div>
              <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase font-cinzel tracking-wider border border-amber-400/40">
                👑 SUPER ADMIN GATEWAY
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 font-moul mt-1.5 drop-shadow-md">
                ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ
              </h1>
              <p className="text-xs text-blue-200 mt-1">
                សូមបញ្ចូលគណនី Admin ដើម្បីគ្រប់គ្រងទិន្នន័យ MySQL & SQLite
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/50 text-rose-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-amber-300/90 uppercase tracking-wider block">
              គណនី Admin ផ្លូវការ (ចុចដើម្បីជ្រើសរើសរហ័ស)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playSound.pop();
                  setEmail('soksithcheyhoout@gmail.com');
                  setPassword('admin123');
                }}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  email === 'soksithcheyhoout@gmail.com'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-extrabold text-xs text-amber-300">👑 Sithchey Hoout</div>
                <div className="text-[9.5px] text-slate-400 truncate font-mono">soksithcheyhoout@gmail.com</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound.pop();
                  setEmail('admin@motdar.gov.kh');
                  setPassword('admin123');
                }}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  email === 'admin@motdar.gov.kh'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-extrabold text-xs text-blue-300">🏛️ MoTDAR Admin</div>
                <div className="text-[9.5px] text-slate-400 truncate font-mono">admin@motdar.gov.kh</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email គណនី Admin</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="soksithcheyhoout@gmail.com"
                required
                className="w-full bg-[#001730] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold shadow-inner"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>លេខសម្ងាត់ Admin</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#001730] border border-white/20 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>ចូលផ្ទាំងបញ្ជា (LOGIN SUPER ADMIN)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>

          </form>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-white/10 text-[11px] text-slate-400">
        © 2026 MoTDAR High School National Digital Platform • Secured MySQL Dual Engine
      </div>

    </div>
  );
}
