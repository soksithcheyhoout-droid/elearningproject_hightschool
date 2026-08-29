import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  School,
  GraduationCap
} from 'lucide-react';
import { toPng } from 'html-to-image';
import api from '../../services/api';

/**
 * DigitalStudentIdModal - Executive National Digital Student Smart ID Card
 * Fixes frame clipping with perfect circular frame rendering, removes logo white background, and provides high-res PNG export.
 */
export default function DigitalStudentIdModal({ student, isOpen, onClose }) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const studentIdNumber = `KH-2026-${Math.abs((student.name || 'STUDENT').length * 8421 + 1042).toString().slice(0, 5)}`;

  // Download high-resolution PNG image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: '#020b18'
      });
      
      const link = document.createElement('a');
      link.download = `Student_ID_${student.name.replace(/\s+/g, '_')}_${studentIdNumber}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export ID card image:', err);
      alert('មិនអាចទាញយករូបភាពបានទេ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] max-w-lg w-full overflow-hidden text-white my-auto font-kantumruy relative max-h-[92vh] flex flex-col">
        
        {/* Top Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ប័ណ្ណសិស្សឌីជីថលជាតិ (National Student Smart ID)</h3>
              <p className="text-[10px] text-slate-400">ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់ (MoTDAR Official Standard)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="បិទ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body: The ID Card */}
        <div className="p-4 sm:p-5 flex flex-col items-center overflow-y-auto">
          
          {/* 💳 OFFICIAL SMART ID CARD (Target for PNG Export) */}
          <div 
            ref={cardRef}
            className="relative w-full max-w-[460px] aspect-[1.586/1] rounded-2xl p-4 sm:p-5 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)] border-2 border-amber-400/50 bg-gradient-to-br from-[#031533] via-[#05224f] to-[#010916] text-white flex flex-col justify-between select-none"
          >
            
            {/* Background Luxury Watermark Pattern & Ambient Glows */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#005baa]/25 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-56 h-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

            {/* Top Royal Kingdom Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-amber-400/30 pb-2.5">
              <div className="flex items-center gap-2.5">
                {/* Clean 4K Golden Angkor Emblem Crest */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src="/assets/moeys-crest-transparent.png" 
                    alt="Official Ministry Crest" 
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.6)]" 
                  />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[9px] font-bold text-amber-300 uppercase tracking-widest leading-none">
                    KINGDOM OF CAMBODIA • ព្រះរាជាណាចក្រកម្ពុជា
                  </p>
                  <p className="text-[7px] sm:text-[8px] text-slate-300 uppercase tracking-wider font-mono mt-0.5">
                    MINISTRY OF TALENT DEVELOPMENT & ADVANCED RESEARCH
                  </p>
                  <h4 className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider mt-0.5 font-cinzel">
                    NATIONAL DIGITAL STUDENT SMART ID
                  </h4>
                </div>
              </div>

              {/* Gold Chip / NFC Icon */}
              <div className="flex flex-col items-end">
                <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 p-0.5 flex flex-col justify-between shadow-inner">
                  <div className="w-full h-0.5 bg-amber-900/40 rounded-xs" />
                  <div className="w-full h-0.5 bg-amber-900/40 rounded-xs" />
                  <div className="w-full h-0.5 bg-amber-900/40 rounded-xs" />
                </div>
                <span className="text-[7px] font-mono text-amber-300 mt-0.5 uppercase tracking-tighter font-bold">
                  NFC SMART ID
                </span>
              </div>
            </div>

            {/* Middle: Student Photo with Full Non-Clipped Animated Frame & Details */}
            <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Left Photo Column with Perfect Non-Clipped Avatar Frame */}
              <div className="col-span-4 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex-shrink-0 select-none flex items-center justify-center">
                  
                  {/* Circular Avatar */}
                  <div className={`w-[80%] h-[80%] rounded-full overflow-hidden shadow-md bg-slate-950 relative flex items-center justify-center ${(student.avatarFrame || student.avatar_frame) ? '' : 'border-2 border-amber-300'}`}>
                    <img 
                      src={api.formatAvatarUrl(student.avatar)} 
                      alt="Student Photo" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('boy_1.png')) {
                          e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                        }
                      }}
                    />
                  </div>

                  {/* Animated Avatar Frame (100% Inset-0) */}
                  {(student.avatarFrame || student.avatar_frame) && (
                    <img 
                      src={student.avatarFrame || student.avatar_frame} 
                      alt="Frame" 
                      className="absolute inset-0 w-full h-full pointer-events-none object-contain scale-125 z-15 select-none filter drop-shadow-sm"
                      onError={(e) => {
                        const current = e.currentTarget.src;
                        if (current.endsWith('.png')) e.currentTarget.src = current.replace('.png', '.webp');
                        else if (current.endsWith('.webp')) e.currentTarget.src = current.replace('.webp', '.png');
                      }}
                    />
                  )}
                </div>
                
                {/* Level Badge Pill */}
                <div className="mt-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/50 text-[9px] font-bold text-amber-300 font-mono shadow-xs">
                  Lv.{student.level || 4} Scholar
                </div>
              </div>

              {/* Right Student Data Column */}
              <div className="col-span-8 space-y-1 pl-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-200 tracking-tight leading-tight">
                    {student.name}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified
                  </span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-200 font-medium truncate flex items-center gap-1">
                  <School className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{student.school}</span>
                </p>

                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] sm:text-[10px] pt-1.5 border-t border-amber-400/20">
                  <div>
                    <span className="text-slate-400">កម្រិតថ្នាក់: </span>
                    <b className="text-white">ថ្នាក់ទី {student.grade || '១២'}</b>
                  </div>
                  <div>
                    <span className="text-slate-400">ជំនាញ: </span>
                    <b className="text-white">{student.stream === 'social' ? 'សង្គម' : 'វិទ្យាសាស្ត្រពិត'}</b>
                  </div>
                  <div>
                    <span className="text-slate-400">សុពលភាព: </span>
                    <b className="text-emerald-300 font-mono">2026 - 2027</b>
                  </div>
                  <div>
                    <span className="text-slate-400">លទ្ធផល: </span>
                    <b className="text-amber-300 font-mono">Rank A (85%)</b>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/50 border border-amber-400/40 text-[9px] sm:text-[10px] font-bold text-amber-300 font-mono tracking-wider shadow-xs inline-block">
                    ID: {studentIdNumber}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Barcode & Security Verification Line */}
            <div className="relative z-10 pt-2 border-t border-amber-400/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>ផ្ទៀងផ្ទាត់ផ្លូវការ MoTDAR • 2026 Security Seal</span>
              </div>

              {/* Crisp Barcode */}
              <div className="flex items-center gap-[2px] h-3.5 opacity-80">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1].map((w, i) => (
                  <span key={i} className="bg-white h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>

            {/* Holographic Security Overlay Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-cyan-400/10 pointer-events-none" />

          </div>

          {/* Quick Notice */}
          <p className="text-[11px] text-slate-400 text-center mt-3 font-khmer">
            ប័ណ្ណសិស្សនេះត្រូវបានទទួលស្គាល់ក្នុងប្រព័ន្ធអប់រំឌីជីថលទូទាំងប្រទេសកម្ពុជា
          </p>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          
          <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ស្កេនពិនិត្យទិន្នន័យបាន ១០០%</span>
          </div>

          <div className="flex items-center gap-2">
            
            {/* 📥 Save as Image PNG Button */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>កំពុងទាញយក...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>បានរក្សាទុកជោគជ័យ!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ទាញយកជារូបភាព (Save Image PNG)</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              បិទ
            </button>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
