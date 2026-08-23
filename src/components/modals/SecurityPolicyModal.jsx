import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, X, Terminal, Cpu, Database } from 'lucide-react';

export default function SecurityPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
      className="flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl font-kantumruy select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,215,0,0.15)] overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shrink-0" />

        {/* ── HEADER ── */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,215,0,0.2)] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-moul text-sm sm:text-base text-amber-300 tracking-wide">
                គោលការណ៍សុវត្ថិភាព និងការការពារធនធានសិក្សាជាតិ
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Ministry of Talent Development & Advanced Research (MoTDAR)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── CONTENT SCROLL ── */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed custom-scrollbar">

          {/* Core Overview Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex gap-3.5">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-amber-200 block">
                មូលហេតុដែលប្រព័ន្ធបិទមុខងារ Inspect Element និង Right-Click
              </span>
              <p className="text-slate-300 leading-relaxed">
                ដើម្បីធានានូវភាពត្រឹមត្រូវ តម្លាភាព និងការពារកម្មសិទ្ធិបញ្ញារបស់វិញ្ញាសាប្រឡងជាតិ ព្រមទាំងការពារទិន្នន័យផ្ទាល់ខ្លួនរបស់សិស្សានុសិស្សទូទាំងប្រទេស ប្រព័ន្ធសិក្សាឌីជីថល MoTDAR បានដាក់ឱ្យប្រើប្រាស់វិធានការការពារសុវត្ថិភាពព័ត៌មានវិទ្យាកម្រិតខ្ពស់។
              </p>
            </div>
          </div>

          {/* Section 1: Exam Integrity */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider text-amber-300">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>១. ការពារភាពសុចរិតនៃវិញ្ញាសាប្រឡង និងតេស្តសមត្ថភាព</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              វិញ្ញាសាប្រឡងសាកល្បងបាក់ឌុប តេស្តប្រចាំថ្ងៃ និងលំហាត់ប្រឡងប្រជែងថ្នាក់ជាតិ មានផ្ទុកនូវកូដវិនិច្ឆ័យចម្លើយ។ ការបិទមុខងារ Inspect Element ជួយទប់ស្កាត់ការមើលចម្លើយជាមុន និងធានាថាពិន្ទុរបស់សិស្សទាំងអស់ឆ្លុះបញ្ចាំងពីសមត្ថភាពពិតប្រាកដ។
            </p>
          </div>

          {/* Section 2: AI & Curriculum IP */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider text-amber-300">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>២. ការពារកម្មសិទ្ធិបញ្ញាប្រព័ន្ធ AI Tutor និងមេរៀនស្រាវជ្រាវ</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              ប្រព័ន្ធ AI Tutor និងគន្លឹះស្រាវជ្រាវកម្រិតខ្ពស់ គឺជាស្នាដៃអភិវឌ្ឍន៍របស់ក្រុមអ្នកបច្ចេកទេសក្រសួង។ ការទប់ស្កាត់ការទាញយកកូដដើម (Source Code) ជួយការពារការលួចចម្លង និងការកេងប្រវ័ញ្ចបច្ចេកវិទ្យាដោយខុសច្បាប់។
            </p>
          </div>

          {/* Section 3: Student Privacy */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider text-amber-300">
              <Database className="w-4 h-4 text-amber-400" />
              <span>៣. សុវត្ថិភាពទិន្នន័យសិស្ស និងប្រព័ន្ធចំណាត់ថ្នាក់ (Leaderboard)</span>
            </div>
            <p className="text-xs text-slate-400 pl-6">
              ទិន្នន័យ XP ពិន្ទុប្រឡង វិញ្ញាបនបត្រឌីជីថល និងព័ត៌មានគណនីរបស់សិស្ស ត្រូវបានការពារដោយកូដនីយកម្ម SSL 256-bit។ ការបិទ DevTools Console ទប់ស្កាត់ការប៉ុនប៉ងកែប្រែទិន្នន័យពិន្ទុដោយមិនស្របច្បាប់។
            </p>
          </div>

          {/* Compliance Checklist */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2.5 text-xs">
            <span className="font-bold text-white block">ស្តង់ដារអនុលោមភាពបច្ចេកទេស ៖</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>SSL/TLS 256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anti-Cheat Sandbox Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Device Telemetry Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Storage of Secret Keys</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-slate-950/70">
          <span className="text-[11px] text-slate-500">
            MoTDAR Cybersecurity Standard v2.5
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
          >
            យល់ព្រម និងបន្តការសិក្សា
          </button>
        </div>
      </div>
    </div>
  );
}
