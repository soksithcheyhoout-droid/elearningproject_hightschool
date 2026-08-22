import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  FileDown, 
  Image as ImageIcon, 
  Award, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

// Helper to compute individual subject grade (A, B, C, D, E, F)
const computeSubjectGrade = (score, max) => {
  const safeScore = Number(score) || 0;
  const safeMax = Number(max) || 75;
  const pct = Math.round((safeScore / safeMax) * 100);

  if (pct >= 85) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 65) return 'C';
  if (pct >= 55) return 'D';
  if (pct >= 45) return 'E';
  return 'F';
};

export default function BacIICertificateModal({
  isOpen,
  onClose,
  student,
  gradeResult,
  totalScore,
  maxPossible = 525,
  percentage,
  stream = 'science',
  scores = {},
  subjects = []
}) {
  const certificateRef = useRef(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const registrationNo = `០១ ១៧៧៩/២៦    មទទ`;
  const tableNo = `៣៨៤`;
  const roomNo = `១៦`;
  const examCenter = student?.school || 'មជ្ឈ.អនុវត្តគរុកោសល្យរាជធានី';
  const studentDisplayName = student?.name || 'សុខ វិបុល';

  // Build subject list with computed grades
  const subjectList = subjects && subjects.length > 0 ? subjects.map((sub) => {
    const val = scores[sub.key] !== undefined ? scores[sub.key] : Math.round(sub.max * 0.85);
    const grade = computeSubjectGrade(val, sub.max);
    return {
      nameKm: sub.nameKm,
      grade: grade,
      score: val,
      max: sub.max
    };
  }) : [
    { nameKm: 'គណិតវិទ្យា', grade: 'A' },
    { nameKm: 'រូបវិទ្យា', grade: 'A' },
    { nameKm: 'គីមីវិទ្យា', grade: 'B' },
    { nameKm: 'ជីវវិទ្យា', grade: 'B' },
    { nameKm: 'ភាសាខ្មែរ', grade: 'B' },
    { nameKm: 'ប្រវត្តិវិទ្យា', grade: 'A' },
    { nameKm: 'ភាសាបរទេស', grade: 'B' },
  ];

  // Direct Save as PDF file
  const handleSaveAsPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloadingPDF(true);
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const printWidth = pdfWidth - margin * 2;
      const printHeight = (certificateRef.current.offsetHeight * printWidth) / certificateRef.current.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', margin, margin, printWidth, Math.min(printHeight, pdfHeight - margin * 2));
      pdf.save(`BacII_Certificate_${studentDisplayName.replace(/\s+/g, '_')}_Grade_${gradeResult?.grade || 'A'}.pdf`);

      setDownloadSuccessMessage('បានរក្សាទុកជា PDF រួចរាល់! ✓');
      setTimeout(() => setDownloadSuccessMessage(''), 3500);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Direct Download HD PNG
  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloadingPNG(true);
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `BacII_Official_Certificate_${studentDisplayName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccessMessage('បានទាញយកជា PNG រួចរាល់! ✓');
      setTimeout(() => setDownloadSuccessMessage(''), 3500);
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn font-kantumruy">
      
      {/* Modal Shell */}
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Action Header */}
        <div className="bg-[#001730] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                វិញ្ញាបនបត្របណ្ដោះអាសន្នមធ្យមសិក្សាទុតិយភូមិ (MoEYS Bac II Certificate)
              </h3>
              <p className="text-[10px] text-amber-300 font-bold">
                លទ្ធផលផ្លូវការ៖ និទ្ទេស {gradeResult?.grade || 'A'} • {totalScore}/{maxPossible} ពិន្ទុ ({percentage}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Direct Save as PDF Button */}
            <button
              type="button"
              onClick={handleSaveAsPDF}
              disabled={isDownloadingPDF}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all border-b-2 border-amber-600 active:translate-y-0.5"
              title="រក្សាទុកជាឯកសារ PDF ផ្ទាល់ទៅកាន់ឧបករណ៍ (Save directly as PDF)"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>{isDownloadingPDF ? 'កំពុងបង្កើត PDF...' : 'រក្សាទុកជា PDF'}</span>
            </button>

            {/* Download PNG Button */}
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isDownloadingPNG}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="ទាញយកជារូបភាព PNG"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{isDownloadingPNG ? 'កំពុងទាញយក...' : 'ទាញយក PNG'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {downloadSuccessMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-400/40 text-emerald-200 text-xs font-black py-2 px-4 text-center animate-fadeIn flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Scrollable Certificate View */}
        <div className="p-3 sm:p-6 overflow-y-auto flex items-center justify-center bg-slate-950/70">
          
          {/* 📜 1:1 EXACT AUTHENTIC CAMBODIAN BAC II CERTIFICATE (PORTRAIT) */}
          <div 
            ref={certificateRef}
            className="certificate-print-area relative w-full max-w-[620px] aspect-[1/1.414] bg-[#ffffff] text-slate-900 rounded-sm p-6 sm:p-8 border-[2.5px] border-[#003876] shadow-2xl select-none flex flex-col justify-between overflow-hidden font-kantumruy"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              minHeight: '840px'
            }}
          >
            
            {/* Subtle Blue Inner Border Frame */}
            <div className="absolute inset-1.5 border border-[#005baa]/40 pointer-events-none" />

            {/* Center Authentic Ministry Watermark - Clearly Visible Background Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.22] pointer-events-none select-none z-0">
              <img 
                src="/assets/moeys-crest-transparent.png" 
                alt="Ministry Official Watermark" 
                className="w-[380px] h-[380px] object-contain filter drop-shadow-sm" 
              />
            </div>

            {/* TOP HEADER SECTION */}
            <div className="relative z-10">
              
              {/* Header Top Columns */}
              <div className="flex items-start justify-between text-[11px] sm:text-xs">
                
                {/* Top Left Ministry Info */}
                <div className="text-left space-y-0.5 text-[#003876] font-bold leading-tight">
                  <p>ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់</p>
                  <p className="text-[10.5px]">នាយកដ្ឋានមធ្យមសិក្សាចំណេះទូទៅ</p>
                  <p className="text-[10px] text-slate-700 font-mono mt-1">
                    លេខ <strong className="text-slate-900 font-bold">{registrationNo}</strong>
                  </p>
                </div>

                {/* Top Center Kingdom Motto */}
                <div className="text-center space-y-0.5 text-[#003876] leading-tight flex-1 px-2">
                  <h2 className="text-xs sm:text-[13px] font-black tracking-wide">
                    ព្រះរាជាណាចក្រកម្ពុជា
                  </h2>
                  <h3 className="text-xs sm:text-[13px] font-black">
                    ជាតិ  សាសនា  ព្រះមហាក្សត្រ
                  </h3>
                  {/* Decorative flourish line */}
                  <div className="flex items-center justify-center gap-1 text-[#003876] text-xs pt-0.5">
                    <span>❖</span>
                    <span className="w-12 h-[1px] bg-[#003876]"></span>
                    <span>❖</span>
                  </div>
                </div>

              </div>

              {/* Main Certificate Title */}
              <div className="text-center my-4 sm:my-5">
                <h1 className="text-base sm:text-[19px] font-black text-[#003876] tracking-wide font-kantumruy">
                  វិញ្ញាបនបត្របណ្ដោះអាសន្នមធ្យមសិក្សាទុតិយភូមិ
                </h1>
                {/* Small ornamental dash */}
                <div className="flex items-center justify-center gap-1 text-[#003876] text-xs mt-1">
                  <span>~ ❖ ~</span>
                </div>
              </div>

              {/* Authority Statement */}
              <div className="text-center font-black text-xs sm:text-[13px] text-[#003876] mb-3">
                ប្រធាននាយកដ្ឋានមធ្យមសិក្សាចំណេះទូទៅ  បញ្ជាក់ថា ៖
              </div>

            </div>

            {/* MIDDLE SECTION: STUDENT PHOTO & PARTICULARS */}
            <div className="relative z-10 flex items-start gap-4 sm:gap-5 my-1 text-xs sm:text-[12.5px] leading-relaxed">
              
              {/* Left: Student Passport Photo (4x6 Blue Backdrop) */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[#2563eb] border-2 border-slate-300 rounded-xs overflow-hidden shadow-xs relative flex items-center justify-center">
                  <img 
                    src={student?.avatar || '/assets/anime/boys/boy_1.png'} 
                    alt="Student Photo" 
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle photo stamp line */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/20 text-[8px] text-white text-center font-mono py-0.5">
                    4 x 6 cm
                  </div>
                </div>
              </div>

              {/* Right: Detailed Candidate Fields */}
              <div className="flex-1 space-y-1.5 text-slate-800">
                
                {/* Name & Gender */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-700">ឈ្មោះ ៖</span>
                    <strong className="text-sm sm:text-base font-black text-[#dc2626] font-kantumruy">
                      {studentDisplayName}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1 pr-2">
                    <span className="text-slate-700">ភេទ ៖</span>
                    <strong className="font-bold text-slate-900">ប្រុស</strong>
                  </div>
                </div>

                {/* Date of Birth & Place */}
                <div className="flex flex-wrap items-center gap-x-2 text-[11.5px] sm:text-xs">
                  <span className="text-slate-700">កើតនៅថ្ងៃទី</span>
                  <strong className="font-bold text-slate-900">១៦ កញ្ញា ២០០៨</strong>
                  <span className="text-slate-700">នៅក្រុង</span>
                  <strong className="font-bold text-slate-900">ភ្នំពេញ</strong>
                </div>

                {/* Parents Name */}
                <div className="flex flex-wrap items-center gap-x-3 text-[11.5px] sm:text-xs">
                  <div>
                    <span className="text-slate-700">ឪពុកឈ្មោះ ៖</span>
                    <strong className="font-bold text-slate-800 ml-1 font-mono text-[11px]">
                      {student?.fatherName ? student.fatherName : '.......................'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-700">ម្តាយឈ្មោះ ៖</span>
                    <strong className="font-bold text-slate-800 ml-1 font-mono text-[11px]">
                      {student?.motherName ? student.motherName : '.......................'}
                    </strong>
                  </div>
                </div>

                {/* Exam Qualification Line */}
                <div className="font-black text-[#003876] text-xs sm:text-[13px] pt-1">
                  បានប្រឡងជាប់សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ
                </div>

                {/* Exam Session & Center */}
                <div className="space-y-0.5 text-[11.5px] sm:text-xs">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className="text-slate-700">សម័យប្រឡង ៖</span>
                    <strong className="font-bold text-slate-900">២៧ កក្កដា ២០២៦</strong>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className="text-slate-700">នៅមណ្ឌល ៖</span>
                    <strong className="font-bold text-slate-900">{examCenter}</strong>
                  </div>
                </div>

                {/* Room, Desk, Overall Grade, Total Score in Red */}
                <div className="flex flex-wrap items-center gap-x-2 pt-1 text-[11.5px] sm:text-xs">
                  <span>លេខបន្ទប់ ៖ <strong className="font-bold text-slate-900 font-mono">{roomNo}</strong></span>
                  <span>លេខតុ ៖ <strong className="font-bold text-slate-900 font-mono">{tableNo}</strong></span>
                  <span>
                    និទ្ទេសរួម ៖ <strong className="text-sm font-black text-[#dc2626] font-mono">{gradeResult?.grade || 'A'}</strong>
                  </span>
                  <span>
                    លំដាប់ពិន្ទុសរុប ៖ <strong className="text-sm font-black text-[#dc2626] font-mono">{totalScore}.00</strong>
                  </span>
                </div>

              </div>

            </div>

            {/* SUBJECT SCORES & GRADES LIST (EXACT REAL FORMAT) */}
            <div className="relative z-10 my-2 pt-2 border-t border-slate-200">
              <div className="font-black text-[#003876] text-xs mb-1.5">
                និទ្ទេសតាមមុខវិជ្ជា ៖
              </div>

              {/* 3-Column Compact Grid of Subject Grades */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-800">
                {subjectList.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-dotted border-slate-300 pb-0.5">
                    <span className="font-bold text-slate-800">{sub.nameKm}</span>
                    <span className="font-black text-xs font-mono text-[#dc2626] pl-2">
                      {sub.grade}
                    </span>
                  </div>
                ))}
              </div>

              {/* Official Usage Sentence */}
              <p className="text-[10px] sm:text-[10.5px] text-slate-700 italic text-center mt-2.5">
                វិញ្ញាបនបត្រនេះ បានចេញជូនសាមីខ្លួន ដើម្បីយកទៅប្រើប្រាស់តាមការដែលអាចប្រើបាន។
              </p>
            </div>

            {/* SIGNATURE & OFFICIAL RED STAMP SECTION */}
            <div className="relative z-10 flex items-end justify-between pt-1">
              
              {/* Left Side Note & Legend */}
              <div className="space-y-0.5 text-[9px] sm:text-[9.5px] text-slate-600 max-w-[250px] leading-tight">
                <p className="font-bold text-slate-800">សំគាល់ ៖</p>
                <p className="font-mono">
                  A ល្អប្រសើរ   B ល្អណាស់   C ល្អ<br/>
                  D ល្អបង្គួរ    E មធ្យម    F ធ្លាក់
                </p>
                <p className="text-[8px] text-slate-500 pt-0.5">
                  - វិញ្ញាបនបត្រនេះប្រើប្រាស់បណ្ដោះអាសន្នរង់ចាំសញ្ញាបត្រជាស្ថាពរ។<br/>
                  - វិញ្ញាបនបត្រនេះពុំមានការកែប្រែដោយដៃ ឬលុបសរសេរជាន់ឡើយ។
                </p>
                {/* Barcode Stamp */}
                <div className="pt-1">
                  <div className="font-mono text-[9px] tracking-tighter text-slate-800">
                    |||||| | |||||||| ||||||||||| | |||||
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-mono">MOEYS-2026-BACII-VERIFIED</span>
                </div>
              </div>

              {/* Right Side Signature & Red Seal Stamp */}
              <div className="relative text-center min-w-[220px] flex flex-col items-center">
                
                <p className="text-[10.5px] text-slate-800 font-kantumruy">
                  ធ្វើនៅរាជធានីភ្នំពេញ, ថ្ងៃទី ១៨ ខែ សីហា ឆ្នាំ ២០២៦
                </p>
                <p className="text-xs font-bold text-[#003876] mt-0.5 font-kantumruy">
                  ប្រធាននាយកដ្ឋានមធ្យមសិក្សាចំណេះទូទៅ
                </p>

                {/* Signature + Seal Container with Perfect Alignment */}
                <div className="relative w-48 h-20 flex items-center justify-center my-0.5">
                  
                  {/* Authentic Red Round Ministry Seal Stamp (Contained within signature area) */}
                  <div className="absolute left-4 top-0 w-20 h-20 rounded-full border-[2.5px] border-[#dc2626] p-1 flex items-center justify-center text-[#dc2626] font-kantumruy rotate-[-8deg] opacity-85 pointer-events-none select-none z-0">
                    <div className="w-full h-full rounded-full border border-[#dc2626] flex flex-col items-center justify-center text-center p-0.5 leading-none bg-rose-50/15">
                      <span className="text-[6.5px] font-black uppercase tracking-tight">
                        ព្រះរាជាណាចក្រកម្ពុជា
                      </span>
                      <span className="text-[9.5px] font-black my-0.5">
                        ★ ត្រាផ្លូវការ ★
                      </span>
                      <span className="text-[6px] font-bold">
                        ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ
                      </span>
                    </div>
                  </div>

                  {/* Authentic Flowing Blue Ink Signature */}
                  <svg 
                    className="w-38 h-14 text-[#0047ab] z-10 select-none pointer-events-none filter drop-shadow-xs" 
                    viewBox="0 0 160 50" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Natural Penmanship Flow */}
                    <path 
                      d="M 12 34 C 18 16, 28 8, 36 18 C 42 28, 40 38, 48 30 C 56 22, 60 14, 66 12 C 72 26, 70 38, 78 28 C 86 18, 92 10, 98 12 C 102 24, 106 36, 114 26 C 122 16, 130 14, 138 20 C 146 26, 142 42, 132 44 C 120 46, 75 42, 22 40" 
                      stroke="#0047ab" 
                      strokeWidth="2.4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M 52 18 L 68 18" 
                      stroke="#0047ab" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                    />
                    <circle cx="48" cy="14" r="1.5" fill="#0047ab" />
                  </svg>
                </div>

                {/* Signatory Name in Bold Red Khmer Font: សិទ្ធិជ័យ */}
                <p className="text-sm font-black text-[#dc2626] font-kantumruy tracking-wide">
                  សិទ្ធិជ័យ
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );

  return createPortal(modalContent, document.body);
}
