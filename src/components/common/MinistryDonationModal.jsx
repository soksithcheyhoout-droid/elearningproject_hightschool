import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Gift, 
  Copy, 
  Check, 
  Code2, 
  Server, 
  Cpu, 
  ArrowRight,
  ArrowLeft,
  Terminal,
  Download,
  DollarSign,
  User,
  MessageSquare,
  Activity,
  RefreshCw,
  AlertCircle,
  Loader2,
  Lock,
  Building2,
  CheckCircle,
  Clock,
  Sparkles,
  Smartphone,
  ExternalLink,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { generateKhqrString, checkBakongTransactionStatus } from '../../utils/khqrGenerator';
import { generateAbaPaymentQr, checkAbaPaymentStatus } from '../../utils/abaPayment';

// Official ABA Bank Logo Badge Component
function AbaLogoBadge({ size = "sm" }) {
  const isSm = size === "sm";
  return (
    <div 
      className={`${
        isSm ? 'w-5 h-5 rounded-[5px] text-[8px]' : 'w-9 h-9 rounded-xl text-[12px]'
      } bg-[#002D56] text-white flex items-center justify-center font-black font-mono tracking-tight shadow-xs flex-shrink-0 select-none border border-white/20 overflow-hidden`}
      style={{ width: isSm ? 20 : 36, height: isSm ? 20 : 36, minWidth: isSm ? 20 : 36, minHeight: isSm ? 20 : 36 }}
    >
      <span className="font-black">ABA</span>
      <span className="text-[#00A3E0] font-black -ml-[0.5px] -mt-[1px]">'</span>
    </div>
  );
}

// Official Bakong NBC Emblem Component
function BakongLogoBadge({ size = "sm" }) {
  const isSm = size === "sm";
  return (
    <div 
      className={`${
        isSm ? 'w-5 h-5 rounded-[5px] p-0.5' : 'w-9 h-9 rounded-xl p-1.5'
      } bg-[rgb(226,26,26)] text-white flex items-center justify-center shadow-xs flex-shrink-0 select-none border border-white/20 overflow-hidden`}
      style={{ width: isSm ? 20 : 36, height: isSm ? 20 : 36, minWidth: isSm ? 20 : 36, minHeight: isSm ? 20 : 36 }}
    >
      <svg width={isSm ? 14 : 22} height={isSm ? 14 : 22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.6" strokeDasharray="2 1.5"/>
        <path d="M12 4.5L15 9.5H9L12 4.5Z" fill="white"/>
        <path d="M12 19.5L9 14.5H15L12 19.5Z" fill="white"/>
        <path d="M4.5 12L9.5 9V15L4.5 12Z" fill="white"/>
        <path d="M19.5 12L14.5 15V9L19.5 12Z" fill="white"/>
        <circle cx="12" cy="12" r="2.2" fill="white"/>
      </svg>
    </div>
  );
}

export default function MinistryDonationModal({ isOpen, onClose }) {
  const { student, addStudentXP } = useAuth();

  const [paymentGateway, setPaymentGateway] = useState('aba'); // 'aba' | 'bakong'
  const [amountType, setAmountType] = useState('usd'); // 'usd' | 'khr'
  const [selectedTier, setSelectedTier] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(student?.name || student?.fullName || 'សិស្សគំរូ');
  const [donorMessage, setDonorMessage] = useState('សូមចូលរួមគាំទ្រការអភិវឌ្ឍន៍ប្រព័ន្ធអប់រំ និងការស្រាវជ្រាវកម្រិតខ្ពស់ជាតិ!');
  const [step, setStep] = useState(1); // 1 = Select Tier, 2 = KHQR Scan, 3 = Success Certificate
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [genStage, setGenStage] = useState(1);
  const [khqrData, setKhqrData] = useState(null);
  const [abaData, setAbaData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState('/assets/moeys-crest-transparent.png');
  
  // Expiration countdown timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [qrRefreshCount, setQrRefreshCount] = useState(0);

  const canvasRef = useRef(null);
  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const usdPresets = [
    { val: 1, label: '$1', title: 'មូលដ្ឋាន', note: 'Basic Support' },
    { val: 3, label: '$3', title: 'គាំទ្រកូដ', note: 'Coding Fuel' },
    { val: 5, label: '$5', title: 'ពេញនិយម', note: 'Dev Fuel', popular: true },
    { val: 10, label: '$10', title: 'Server ១ ខែ', note: 'Cloud Hosting' },
    { val: 25, label: '$25', title: 'AI Tokens', note: 'AI API Cost' },
    { val: 50, label: '$50', title: 'សប្បុរសជន', note: 'VIP Sponsor' },
  ];

  const khrPresets = [
    { val: 4000, label: '4,000 ៛', title: 'មូលដ្ឋាន', note: 'Basic Support' },
    { val: 12000, label: '12,000 ៛', title: 'គាំទ្រកូដ', note: 'Coding Fuel' },
    { val: 20000, label: '20,000 ៛', title: 'ពេញនិយម', note: 'Dev Fuel', popular: true },
    { val: 40000, label: '40,000 ៛', title: 'Server ១ ខែ', note: 'Cloud Hosting' },
    { val: 100000, label: '100,000 ៛', title: 'AI Tokens', note: 'AI API Cost' },
    { val: 200000, label: '200,000 ៛', title: 'សប្បុរសជន', note: 'VIP Sponsor' },
  ];

  const currentAmount = customAmount ? Number(customAmount) : selectedTier;
  const displayAmount = amountType === 'usd' ? `$${Number(currentAmount).toFixed(2)}` : `${Number(currentAmount).toLocaleString()} ៛`;

  const [sessionBillNumber, setSessionBillNumber] = useState('');

  // Pre-generate Initial QR Data
  useEffect(() => {
    if (isOpen) {
      try {
        const billNum = sessionBillNumber || ('TXN' + Date.now());
        if (!sessionBillNumber) setSessionBillNumber(billNum);

        const generated = generateKhqrString({
          bakongAccount: 'hut_soksitchey1@aclb',
          merchantName: 'chey_dev',
          merchantCity: 'Phnom Penh',
          currency: amountType === 'usd' ? 'USD' : 'KHR',
          amount: currentAmount,
          billNumber: billNum,
          storeLabel: 'chey_dev'
        });
        setKhqrData(generated);
      } catch (e) {
        console.warn('[QR Gen Error]:', e);
      }
    }
  }, [isOpen, currentAmount, amountType, qrRefreshCount, sessionBillNumber]);

  // Handle countdown & dynamic auto-poll for Bakong or ABA when on Step 2
  useEffect(() => {
    if (step === 2 && isOpen) {
      setTimeLeft(300);
      setIsExpired(false);

      // 1. Live Countdown Timer (1 second interval)
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Continuous Auto-Polling: ABA Gateway OR Bakong NBC Gateway (every 2.0s)
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      pollTimerRef.current = setInterval(async () => {
        try {
          if (paymentGateway === 'aba' && abaData) {
            const res = await checkAbaPaymentStatus({
              tranId: abaData.tranId,
              clientId: abaData.clientId,
              requestTime: abaData.requestTime,
              token: abaData.token,
              merchantLink: abaData.merchantLink
            });
            if (res && (res.paid === true || res.status === 'PAID')) {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
              if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
              handlePaymentSuccess();
            }
          } else if (paymentGateway === 'bakong' && khqrData) {
            const res = await checkBakongTransactionStatus(khqrData.md5);
            if (res && res.status === 'SUCCESS') {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
              if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
              handlePaymentSuccess();
            }
          }
        } catch (e) {
          // ignore network hiccups
        }
      }, 2000);

      return () => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    }
  }, [step, isOpen, khqrData, abaData, paymentGateway]);

  if (!isOpen) return null;

  // Dual Connection Flow Sequence (ABA PayWay vs Bakong)
  const handleProceedToQR = async () => {
    playSound.click?.();
    setIsExpired(false);
    setTimeLeft(300);
    const newBillNum = 'TXN' + Date.now();
    setSessionBillNumber(newBillNum);
    setQrRefreshCount(prev => prev + 1);
    setIsGeneratingQR(true);
    setGenStage(1);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    setTimeout(() => {
      setGenStage(2);
    }, 450);

    setTimeout(() => {
      setGenStage(3);
    }, 900);

    try {
      if (paymentGateway === 'aba') {
        // Generate via real ABA PayWay API
        const abaRes = await generateAbaPaymentQr({
          amount: currentAmount,
          currency: amountType
        });
        if (abaRes && abaRes.success) {
          setAbaData(abaRes);
        } else {
          // Fallback to local KHQR if ABA API has temporary timeout
          const generated = generateKhqrString({
            bakongAccount: 'hut_soksitchey1@aclb',
            merchantName: 'chey_dev',
            merchantCity: 'Phnom Penh',
            currency: amountType === 'usd' ? 'USD' : 'KHR',
            amount: currentAmount,
            billNumber: newBillNum,
            storeLabel: 'chey_dev'
          });
          setKhqrData(generated);
        }
      } else {
        // Generate Bakong KHQR
        const generated = generateKhqrString({
          bakongAccount: 'hut_soksitchey1@aclb',
          merchantName: 'chey_dev',
          merchantCity: 'Phnom Penh',
          currency: amountType === 'usd' ? 'USD' : 'KHR',
          amount: currentAmount,
          billNumber: newBillNum,
          storeLabel: 'chey_dev'
        });
        setKhqrData(generated);
      }
    } catch (err) {
      console.warn('QR Generation Error:', err);
    }

    // Preload audio so it is ready
    const scanAudio = new Audio('/assets/audio/qr-scan-sreymom.mp3?v=2');
    scanAudio.preload = 'auto';
    scanAudio.volume = 1.0;

    setTimeout(() => {
      setIsGeneratingQR(false);
      setStep(2);
      setIsExpired(false);

      // Play voice announcement exactly when QR card is displayed on screen!
      try {
        scanAudio.play().catch(() => {});
      } catch (e) {}
    }, 1400);
  };

  const handlePaymentSuccess = () => {
    playSound.correct?.();

    // Play Success Voice Announcement in Khmer: "ការទូទាត់ប្រាក់បានជោគជ័យ! សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅ..."
    try {
      const successAudio = new Audio('/assets/audio/khmer-payment-sreymom.mp3?v=2');
      successAudio.volume = 1.0;
      successAudio.play().catch(() => {});
    } catch (e) {}

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#005baa', '#e11d48', '#10b981', '#f59e0b', '#8b5cf6']
    });

    if (addStudentXP) {
      addStudentXP(500);
    }
    setStep(3);
  };

  const handleDownloadQr = () => {
    try {
      const svg = document.querySelector('.khqr-svg-wrapper svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 600;
          const context = canvas.getContext('2d');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, 600, 600);
          context.drawImage(image, 0, 0, 600, 600);
          const png = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `KHQR_${paymentGateway.toUpperCase()}_CHEY_DEV_${currentAmount}_${amountType.toUpperCase()}.png`;
          link.href = png;
          link.click();
          URL.revokeObjectURL(blobURL);
        };
        image.src = blobURL;
      }
    } catch (e) {
      console.warn('Download QR failed', e);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-kantumruy select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#091124] rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,10,30,0.7)] border border-slate-800 overflow-hidden animate-scaleUp flex flex-col md:flex-row max-h-[92vh] sm:max-h-[94vh] my-auto text-white">
        
        {/* Absolute Top-Right Floating Close Button for Mobile Only */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
          title="បិទផ្ទាំង (Close)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ══════════ MOBILE COMPACT DEVELOPER HEADER (Visible on Mobile only: md:hidden) ══════════ */}
        <div className="md:hidden bg-[#091124] text-white p-3.5 pr-12 relative overflow-hidden flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          {/* Mobile Watermark Background Logo */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20">
            <img src="/assets/moeys-crest-transparent.png" alt="" className="w-20 h-20 object-contain" />
          </div>
          <div className="flex items-center gap-3 relative z-10 min-w-0">
            <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] rounded-full overflow-hidden shadow bg-slate-950 ring-2 ring-purple-400">
                <img
                  src="/assets/developer-avatar.jpg"
                  alt="Developer Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <img
                src="/assets/frames/malefic_crown.webp"
                alt="Crown"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-125 -translate-y-1 z-10"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-white font-mono truncate">chey_dev</span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-black">✓</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate">HUT SOKSITCHEY • Full-Stack Dev</span>
            </div>
          </div>

          <span className={`relative z-10 flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0 ${
            paymentGateway === 'aba'
              ? 'text-cyan-400 bg-slate-900 border border-cyan-500/30'
              : 'text-emerald-400 bg-slate-900 border border-emerald-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              paymentGateway === 'aba' ? 'bg-cyan-400' : 'bg-emerald-400'
            }`} />
            <span>{paymentGateway === 'aba' ? 'ABA LIVE' : 'BAKONG'}</span>
          </span>
        </div>

        {/* ══════════ DESKTOP FULL DEVELOPER SHOWCASE PANEL (Visible on Desktop only: hidden md:flex) ══════════ */}
        <div className="hidden md:flex md:w-5/12 bg-[#091124] text-white p-6 sm:p-7 flex-col justify-between relative overflow-hidden flex-shrink-0 border-r border-slate-800">
          
          {/* Background Ministry Emblem Ambient Art */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
            <img
              src="/assets/moeys-crest-transparent.png"
              alt="Ministry Crest Background"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain opacity-25 filter drop-shadow-[0_0_35px_rgba(234,179,8,0.3)] animate-pulse"
              onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
            />
            {/* Dynamic Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#091124]/75 via-[#091124]/55 to-[#091124]/90" />
          </div>

          <div className="relative z-10 space-y-4">
            
            {/* Top Status Header */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-blue-400/30 shadow-xs">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest font-mono">
                  DEVELOPER PATRON
                </span>
              </div>
              <span className={`flex items-center gap-1.5 text-[10.5px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                paymentGateway === 'aba'
                  ? 'text-cyan-400 bg-slate-900/90 border border-cyan-500/30'
                  : 'text-emerald-400 bg-slate-900/90 border border-emerald-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  paymentGateway === 'aba' ? 'bg-cyan-400' : 'bg-emerald-400'
                }`} />
                <span>{paymentGateway === 'aba' ? 'ABA LIVE' : 'BAKONG LIVE'}</span>
              </span>
            </div>

            {/* Clean Frosted Developer Profile Card (chey_dev) */}
            <div className="bg-slate-950/75 border border-white/15 rounded-3xl p-4 sm:p-5 text-center shadow-lg backdrop-blur-md relative overflow-hidden">
              
              {/* Mythic Avatar Frame */}
              <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-3 flex items-center justify-center">
                <div className="w-[76%] h-[76%] rounded-full overflow-hidden shadow-xl bg-slate-950 ring-2 ring-purple-400/90">
                  <img
                    src="/assets/developer-avatar.jpg"
                    alt="Developer Profile"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <img
                  src="/assets/frames/malefic_crown.webp"
                  alt="Malefic Crown (Mythic)"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[1.32] -translate-y-2 z-10"
                />

                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-1.5 rounded-xl border-2 border-slate-900 shadow-md z-20">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Developer Credentials */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="font-black text-base text-white font-mono">chey_dev</h4>
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-black" title="Verified Creator">✓</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-purple-300 font-bold">
                  <span>HUT SOKSITCHEY</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400">@chey_dev</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium pt-0.5">អ្នកបង្កើតប្រព័ន្ធ E-Learning វិទ្យាល័យជាតិ</p>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-white/10 text-[10px] font-mono text-slate-300">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/10 font-bold">@chey_dev</span>
                  <span className={`px-2.5 py-0.5 rounded-lg border font-bold ${
                    paymentGateway === 'aba'
                      ? 'bg-[#002D56]/60 border-[#00A3E0]/40 text-cyan-300'
                      : 'bg-red-950/60 border-red-500/40 text-red-300'
                  }`}>
                    {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong KHQR'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/10 font-bold">Full-Stack Dev</span>
                </div>
              </div>
            </div>

            {/* Infrastructure Breakdown */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/75 border border-white/10 shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center flex-shrink-0">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] leading-snug">
                  <span className="font-bold text-white block">Cloud Infrastructure 24/7</span>
                  <span className="text-slate-300 text-[9.5px]">ដំណើរការបណ្តាញទូទាំងប្រទេសគ្មានការរអាក់រអួល</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Verification Note */}
          <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{paymentGateway === 'aba' ? 'Direct ABA Gateway' : 'Direct Bakong Gateway'}</span>
            </span>
            <span className="font-mono text-slate-300 font-bold">
              {paymentGateway === 'aba' ? 'ABA PayWay API' : 'EMVCo KHQR'}
            </span>
          </div>
        </div>

        {/* ══════════ RIGHT INTERACTIVE FORM & BAKONG KHQR ══════════ */}
        <div className="flex-1 flex flex-col justify-between bg-[#0b1328] p-4 sm:p-6 md:p-7 overflow-y-auto relative min-h-0 text-white">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="space-y-0.5 pr-8 md:pr-0">
              <span className="text-[9.5px] sm:text-[10px] font-mono uppercase font-black text-red-500 tracking-wider block">
                {step === 1 
                  ? 'STEP 1 OF 2 : ជ្រើសរើសចំនួនទឹកប្រាក់' 
                  : step === 2 
                    ? (paymentGateway === 'aba' ? 'STEP 2 OF 2 : ស្កេនទូទាត់ ABA PAYWAY' : 'STEP 2 OF 2 : ស្កេនទូទាត់ BAKONG KHQR') 
                    : 'CONFIRMATION'}
              </span>
              <h3 className="text-xs sm:text-base font-black text-white font-kantumruy">
                {step === 1 
                  ? 'ឧបត្ថម្ភគាំទ្រ Developer (Support Developers)' 
                  : step === 2 
                    ? (paymentGateway === 'aba' ? 'ស្កេនទូទាត់ ABA PayWay KHQR Card' : 'ស្កេនទូទាត់ Bakong KHQR Card') 
                    : 'លិខិតថ្លែងអំណរគុណឌីជីថល'}
              </h3>
            </div>
            
            {/* Desktop-only internal close button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden md:flex w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white items-center justify-center transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ══════════ HIGH-END BAKONG GATEWAY CONNECTION FLOW WITH ANIMATED SVG STREAM ══════════ */}
          {isGeneratingQR && (
            <div className="my-auto py-3 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
              
              {/* Connected Payment Flow Card */}
              <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
                
                {/* 3-Node Connected Diagram with Animated SVG Flow Stream Line */}
                <div className="flex items-center justify-between gap-2 relative">
                  
                  {/* Left Node: chey_dev */}
                  <div className="flex flex-col items-center text-center w-24">
                    <div className="relative w-13 h-13 rounded-2xl bg-slate-950 border-2 border-purple-500/80 p-0.5 shadow-md flex items-center justify-center">
                      <img src="/assets/developer-avatar.jpg" alt="chey_dev" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">✓</div>
                    </div>
                    <span className="text-[11.5px] font-mono font-black text-white mt-2">chey_dev</span>
                    <span className="text-[9px] text-slate-400 font-mono">Developer ID</span>
                  </div>

                  {/* Center Animated Data Flow Pipeline Line */}
                  <div className="flex-1 flex flex-col items-center justify-center px-1 relative">
                    
                    {/* SVG Flow Line */}
                    <div className="relative w-full h-10 flex items-center justify-center">
                      <svg className="w-full h-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                        {/* Background track line */}
                        <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Animated gradient flow line */}
                        <line 
                          x1="0" 
                          y1="10" 
                          x2="100" 
                          y2="10" 
                          stroke="url(#flowGradient)" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          className="animate-flow-dash" 
                        />
                        <defs>
                          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor={paymentGateway === 'aba' ? '#00A3E0' : '#ef4444'} />
                            <stop offset="100%" stopColor={paymentGateway === 'aba' ? '#002D56' : '#e11d48'} />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Security Lock Badge */}
                      <div className="absolute z-10 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 shadow-xs flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[9px] font-mono font-bold text-slate-300">TLS 1.3 / EMVCo</span>
                      </div>
                    </div>
                    
                    <span className="text-[9px] font-mono text-slate-400 font-medium">Encrypted Handshake</span>
                  </div>

                  {/* Right Node: Gateway Target (ABA PayWay vs Bakong NBC) */}
                  <div className="flex flex-col items-center text-center w-24">
                    {paymentGateway === 'aba' ? (
                      <div className="relative w-13 h-13 rounded-2xl bg-[#002D56] border-2 border-[#00A3E0]/70 p-2 shadow-md flex items-center justify-center">
                        <div className="flex items-center justify-center font-black text-white font-mono tracking-tighter text-base select-none">
                          <span>ABA</span>
                          <span className="text-[#00A3E0] -ml-[1px]">'</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-13 h-13 rounded-2xl bg-[rgb(226,26,26)] border-2 border-red-400 p-2 shadow-md flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 60 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
                          <path d="M39.006 5.19439V9.59764H34.5318C34.0729 9.59764 33.7288 9.2307 33.7288 8.80731V5.22264C33.7288 4.77103 34.1016 4.43231 34.5318 4.43231H38.1743C38.6619 4.40408 39.006 4.74278 39.006 5.19439Z" fill="white"/>
                          <path d="M59.9717 6.97176H57.7345C57.7345 4.34676 55.5548 2.20159 52.8875 2.20159C50.7651 2.20159 48.9008 3.55645 48.2699 5.53225C48.1265 6.01209 48.0404 6.49192 48.0404 6.97176V13.9718H47.9831C46.7785 13.9718 45.8033 13.0121 45.8033 11.8266V6.97176H45.832C45.832 5.05241 46.6351 3.21773 48.0691 1.89112C49.3884 0.677406 51.1093 0 52.9162 0C56.8168 0 59.9717 3.13305 59.9717 6.97176Z" fill="white"/>
                          <path d="M59.9999 13.9718L56.845 14L56.0706 13.2379L54.3497 11.5444L51.9692 9.20166H55.1241L59.9999 13.9718Z" fill="white"/>
                          <path d="M39.7517 11.7702H33.0117C32.1799 11.7702 31.5203 11.121 31.5203 10.3024V3.66936C31.5203 2.85081 32.1799 2.20159 33.0117 2.20159H39.7517C40.5834 2.20159 41.2431 2.85081 41.2431 3.66936V10.3024L43.4802 12.504V2.14515C43.4802 0.959671 42.505 0 41.3005 0H31.4629C30.2583 0 29.2832 0.959671 29.2832 2.14515V11.8266C29.2832 13.0121 30.2583 13.9718 31.4629 13.9718H41.9888L39.7517 11.7702Z" fill="white"/>
                          <path d="M12.3614 14H9.20656L2.60996 7.47984V14H0V0H2.60996V6.2379L8.94843 0H12.046L5.16255 6.71772L12.3614 14Z" fill="white"/>
                          <path d="M24.1492 0H26.7018V14H24.1492V7.93145H16.8643V14H14.3117V0H16.8643V5.84273H24.1492V0Z" fill="white"/>
                        </svg>
                      </div>
                    )}
                    <span className={`text-[11.5px] font-mono font-bold mt-2 ${
                      paymentGateway === 'aba' ? 'text-[#00A3E0]' : 'text-red-400'
                    }`}>
                      {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong NBC'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {paymentGateway === 'aba' ? 'Bank Gateway' : 'National Gateway'}
                    </span>
                  </div>

                </div>

              </div>

              {/* 3-Step Clean Telemetry Card */}
              <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 text-left shadow-lg">
                
                {/* Step 1 */}
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    genStage >= 1 ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {genStage > 1 ? '✓' : <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white block leading-none text-[11.5px]">
                      {paymentGateway === 'aba' ? 'តភ្ជាប់ប្រព័ន្ធ ABA Bank PayWay Gateway' : 'តភ្ជាប់ប្រព័ន្ធ Bakong NBC Gateway'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {genStage > 1 ? 'Secure Handshake OK • Endpoint 200 OK' : 'Establishing Secure Session...'}
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    genStage >= 2 ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {genStage > 2 ? '✓' : genStage === 2 ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> : '2'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white block leading-none text-[11.5px]">
                      ផ្ទៀងផ្ទាត់គណនី Developer @chey_dev
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {genStage >= 2 ? (paymentGateway === 'aba' ? 'ABA Merchant ID Verified • ' + displayAmount : 'Tag 29 Verified • ' + displayAmount) : 'Verifying Account Security...'}
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    genStage >= 3 ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {genStage === 3 ? <Loader2 className="w-3 h-3 animate-spin text-red-400" /> : '3'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white block leading-none text-[11.5px]">
                      {paymentGateway === 'aba' ? 'បង្កើតកាត ABA PayWay KHQR ជាមួយ 1-Click Link' : 'បង្កើតកាត Bakong KHQR ជាមួយ Logo ក្រសួង'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {genStage >= 3 ? 'Real KHQR Generated for @chey_dev' : 'Compiling KHQR Card Payload...'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Clean Developer Footnote Pill */}
              <div className="text-center">
                <span className="text-[10.5px] font-mono text-slate-400 bg-slate-900 px-3.5 py-1 rounded-full border border-slate-800">
                  Gateway: <strong className="text-white uppercase">{paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong NBC'}</strong> • Dev: <strong className="text-slate-200">@chey_dev</strong> • Currency: <strong className="text-red-400">{amountType.toUpperCase()}</strong>
                </span>
              </div>

            </div>
          )}

          {/* ── STEP 1: Select Amount & Gateway ── */}
          {step === 1 && !isGeneratingQR && (
            <div className="space-y-3.5 py-2 animate-fadeIn">
              
              {/* Payment Gateway Selector: ABA PayWay vs Bakong KHQR */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  ជ្រើសរើសវិធីសាស្ត្រទូទាត់ (Payment Gateway)៖
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Option 1: ABA PayWay */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('aba')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-2.5 ${
                      paymentGateway === 'aba'
                        ? 'bg-[#002D56]/80 border-2 border-[#00A3E0] shadow-md ring-2 ring-[#00A3E0]/50'
                        : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <AbaLogoBadge size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-black text-xs text-white">ABA PayWay</span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-[#00A3E0]/20 text-cyan-300 font-bold">1-Click</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block truncate">Direct ABA Mobile</span>
                    </div>
                    {paymentGateway === 'aba' && (
                      <div className="w-4 h-4 rounded-full bg-[#00A3E0] text-slate-950 flex items-center justify-center text-[9px] font-bold">✓</div>
                    )}
                  </button>

                  {/* Option 2: Bakong KHQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('bakong')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-2.5 ${
                      paymentGateway === 'bakong'
                        ? 'bg-red-950/80 border-2 border-red-500 shadow-md ring-2 ring-red-500/50'
                        : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <BakongLogoBadge size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-black text-xs text-white">Bakong KHQR</span>
                        <span className="text-[8px] px-1 py-0.2 rounded bg-red-900/50 text-red-300 font-bold">All Banks</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block truncate">National NBC System</span>
                    </div>
                    {paymentGateway === 'bakong' && (
                      <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold">✓</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Currency Segmented Control */}
              <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAmountType('usd'); setSelectedTier(5); setCustomAmount(''); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    amountType === 'usd'
                      ? 'bg-[#002D56] text-white border border-[#00A3E0]/40 shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ប្រាក់ដុល្លារ (USD $)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAmountType('khr'); setSelectedTier(20000); setCustomAmount(''); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    amountType === 'khr'
                      ? 'bg-red-950 text-white border border-red-500/40 shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono font-bold text-red-400 text-[11px]">KHR</span>
                  <span>ប្រាក់រៀល (KHR)</span>
                </button>
              </div>

              {/* Amount Tiers Grid */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  ជ្រើសរើសកម្រិតទឹកប្រាក់ឧបត្ថម្ភ៖
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(amountType === 'usd' ? usdPresets : khrPresets).map((tier) => {
                    const isSelected = selectedTier === tier.val && !customAmount;
                    return (
                      <button
                        key={tier.val}
                        type="button"
                        onClick={() => { setSelectedTier(tier.val); setCustomAmount(''); }}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[64px] ${
                          isSelected
                            ? paymentGateway === 'aba'
                              ? 'bg-[#002D56] border-2 border-[#00A3E0] text-white shadow-md ring-2 ring-[#00A3E0]/40'
                              : 'bg-red-950 border-2 border-red-500 text-white shadow-md ring-2 ring-red-400/50'
                            : 'bg-slate-900/90 border border-slate-800 text-white hover:border-slate-700 hover:bg-slate-800/80'
                        }`}
                      >
                        {tier.popular && (
                          <span className={`absolute top-0 right-0 text-slate-950 font-black text-[7.5px] px-1.5 py-0.2 rounded-bl-md uppercase tracking-wider ${
                            paymentGateway === 'aba' ? 'bg-[#00A3E0]' : 'bg-red-500 text-white'
                          }`}>
                            Popular
                          </span>
                        )}
                        <span className="font-mono font-black text-sm leading-none text-white">
                          {tier.label}
                        </span>
                        <span className={`text-[9.5px] font-bold mt-1 leading-none ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                          {tier.title}
                        </span>
                        <span className={`text-[8.5px] font-mono mt-0.5 leading-none ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {tier.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  ឬបញ្ចូលចំនួនទឹកប្រាក់ផ្សេងទៀត៖
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={amountType === 'usd' ? 'ឧ. 15.00' : 'ឧ. 60000'}
                    className="w-full pl-3.5 pr-16 py-2 rounded-xl border border-slate-700/80 bg-slate-900/90 focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] text-xs font-bold text-white transition-all font-mono placeholder:text-slate-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-mono">
                    {amountType === 'usd' ? 'USD ($)' : 'KHR'}
                  </span>
                </div>
              </div>

              {/* Donor Name & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>ឈ្មោះអ្នកឧបត្ថម្ភ៖</span>
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-900/90 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0]"
                    placeholder="ឈ្មោះរបស់អ្នក"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-0.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>សារលើកទឹកចិត្ត (Message)៖</span>
                  </label>
                  <input
                    type="text"
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-900/90 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0]"
                    placeholder="សារជូនពរ ឬលើកទឹកចិត្ត..."
                  />
                </div>
              </div>

              {/* Submit CTA Button with Animation Trigger */}
              <button
                type="button"
                onClick={handleProceedToQR}
                className={`w-full py-3 rounded-2xl text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                  paymentGateway === 'aba'
                    ? 'bg-gradient-to-r from-[#002D56] via-[#004B87] to-[#00A3E0] hover:brightness-110'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600'
                }`}
              >
                <span>បន្តទៅទូទាត់ជាមួយ {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong'} ({displayAmount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Authentic QR Card Screen with Live Auto-Check & 1-Click Mobile Deep Link ── */}
          {step === 2 && !isGeneratingQR && (
            <div className="space-y-3.5 py-1 flex flex-col items-center justify-center animate-fadeIn">
              
              {/* Dynamic Payment Card (ABA PayWay vs Bakong KHQR) */}
              <div className="rounded-[22px] w-[285px] sm:w-[300px] flex flex-col bg-[#0b1428] shadow-[0_18px_40px_rgba(0,10,30,0.6)] border border-slate-700/80 overflow-hidden text-white relative">
                
                {/* Header Bar: KHQR Vector Header with Dynamic Theme Color (ABA Blue vs Bakong Red) */}
                <div 
                  className="flex items-center justify-center h-[46px] transition-colors relative shadow-xs"
                  style={{ backgroundColor: paymentGateway === 'aba' ? '#002D56' : 'rgb(226,26,26)' }}
                >
                  <svg width="64" height="15" viewBox="0 0 60 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.006 5.19439V9.59764H34.5318C34.0729 9.59764 33.7288 9.2307 33.7288 8.80731V5.22264C33.7288 4.77103 34.1016 4.43231 34.5318 4.43231H38.1743C38.6619 4.40408 39.006 4.74278 39.006 5.19439Z" fill="white"/>
                    <path d="M59.9717 6.97176H57.7345C57.7345 4.34676 55.5548 2.20159 52.8875 2.20159C50.7651 2.20159 48.9008 3.55645 48.2699 5.53225C48.1265 6.01209 48.0404 6.49192 48.0404 6.97176V13.9718H47.9831C46.7785 13.9718 45.8033 13.0121 45.8033 11.8266V6.97176H45.832C45.832 5.05241 46.6351 3.21773 48.0691 1.89112C49.3884 0.677406 51.1093 0 52.9162 0C56.8168 0 59.9717 3.13305 59.9717 6.97176Z" fill="white"/>
                    <path d="M59.9999 13.9718L56.845 14L56.0706 13.2379L54.3497 11.5444L51.9692 9.20166H55.1241L59.9999 13.9718Z" fill="white"/>
                    <path d="M39.7517 11.7702H33.0117C32.1799 11.7702 31.5203 11.121 31.5203 10.3024V3.66936C31.5203 2.85081 32.1799 2.20159 33.0117 2.20159H39.7517C40.5834 2.20159 41.2431 2.85081 41.2431 3.66936V10.3024L43.4802 12.504V2.14515C43.4802 0.959671 42.505 0 41.3005 0H31.4629C30.2583 0 29.2832 0.959671 29.2832 2.14515V11.8266C29.2832 13.0121 30.2583 13.9718 31.4629 13.9718H41.9888L39.7517 11.7702Z" fill="white"/>
                    <path d="M12.3614 14H9.20656L2.60996 7.47984V14H0V0H2.60996V6.2379L8.94843 0H12.046L5.16255 6.71772L12.3614 14Z" fill="white"/>
                    <path d="M24.1492 0H26.7018V14H24.1492V7.93145H16.8643V14H14.3117V0H16.8643V5.84273H24.1492V0Z" fill="white"/>
                  </svg>
                </div>

                {/* Right Fold Triangle Notch with Dynamic Theme Color */}
                <div className="flex justify-end">
                  <div style={{
                    borderLeft: '20px solid transparent',
                    borderTop: `20px solid ${paymentGateway === 'aba' ? '#002D56' : 'rgb(226, 26, 26)'}`,
                    height: 0,
                    width: 0
                  }}></div>
                </div>

                {/* Merchant Name chey_dev & Amount */}
                <div className="py-2.5 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-amber-400/15 border border-amber-400/30 p-0.5 flex items-center justify-center">
                        <img src="/assets/moeys-crest-transparent.png" alt="Crest" className="w-full h-full object-contain filter drop-shadow-xs" />
                      </div>
                      <span className="text-[12.5px] font-black text-white font-mono tracking-wide">chey_dev</span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                      paymentGateway === 'aba' 
                        ? 'bg-[#002D56] text-[#00A3E0] border-[#00A3E0]/40' 
                        : 'bg-red-950 text-red-400 border-red-500/40'
                    }`}>
                      {paymentGateway === 'aba' ? 'ABA Merchant ID' : 'Bakong Merchant ID'}
                    </span>
                  </div>

                  {/* PRICE DISPLAY - PERFECT FINTECH TYPOGRAPHY */}
                  <div className="mt-2 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className={`text-lg font-black ${paymentGateway === 'aba' ? 'text-[#00A3E0]' : 'text-red-400'}`}>
                        {amountType === 'usd' ? '$' : '៛'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                        {amountType === 'usd' ? Number(currentAmount).toFixed(2) : Number(currentAmount).toLocaleString()}
                      </span>
                      <span className={`text-[10.5px] font-mono font-black ml-1 px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        paymentGateway === 'aba' ? 'bg-[#002D56] text-cyan-300 border border-[#00A3E0]/30' : 'bg-red-950 text-red-300 border border-red-500/30'
                      }`}>
                        {amountType.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Total Amount</span>
                      <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1 justify-end font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                        Zero Fee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated dashed divider */}
                <div className="w-full border-b border-dashed border-slate-700/70 my-0.5" />

                {/* Vector QR Code SVG with High-DPI Center Crest Badge */}
                <div className="flex justify-center items-center relative p-3 bg-white/95 rounded-2xl mx-3.5 my-2 shadow-inner min-h-[195px] khqr-svg-wrapper">
                  <div className="relative bg-white rounded-xl p-1 flex items-center justify-center min-w-[180px] min-h-[180px]">
                    <div className="relative w-[180px] h-[180px] flex items-center justify-center p-1 bg-white rounded-lg">
                      <QRCodeSVG
                        value={
                          (paymentGateway === 'aba' && abaData?.qrString)
                            ? abaData.qrString
                            : (khqrData?.qrString || generateKhqrString({
                                bakongAccount: 'hut_soksitchey1@aclb',
                                merchantName: 'chey_dev',
                                merchantCity: 'Phnom Penh',
                                currency: amountType === 'usd' ? 'USD' : 'KHR',
                                amount: currentAmount,
                                storeLabel: 'chey_dev'
                              }).qrString)
                        }
                        size={175}
                        level="H"
                        marginSize={1}
                        fgColor={paymentGateway === 'aba' ? '#002D56' : '#081b37'}
                        bgColor="#ffffff"
                        imageSettings={{
                          src: '/assets/moeys-crest-transparent.png',
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                      
                      {/* Ultra-Crisp High-DPI Golden Crest Center Badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.18)] border border-slate-100 flex items-center justify-center p-1 pointer-events-none ring-2 ring-white">
                        <img 
                          src="/assets/moeys-crest-transparent.png" 
                          alt="Ministry Golden Crest" 
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expired Overlay if timer reaches 0 */}
                  {isExpired && (
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 rounded-2xl">
                      <AlertCircle className="w-8 h-8 text-amber-400 mb-1" />
                      <p className="text-xs font-bold text-white">កាត QR ផុតកំណត់</p>
                      <p className="text-[10.5px] text-slate-400 mb-3">សូមចុច Refresh ដើម្បីបង្កើតកាតថ្មី</p>
                      <button
                        type="button"
                        onClick={handleProceedToQR}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors shadow-xs cursor-pointer border border-slate-700"
                      >
                        បង្កើតកាតថ្មី (Refresh)
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Subtitle */}
                <div className="pb-2.5 pt-0.5 text-center px-2">
                  <p className="text-[10.5px] text-slate-300 leading-tight">
                    {paymentGateway === 'aba' ? (
                      <span>ស្កេនជាមួយ <strong className="text-white font-bold">ABA Mobile</strong> ឬ KHQR គ្រប់ធនាគារ</span>
                    ) : (
                      <span>Scan with <strong className="text-white font-bold">Bakong</strong> ឬ KHQR App គ្រប់ធនាគារ</span>
                    )}
                  </p>
                </div>
              </div>

              {/* High-End Fintech Auto-Checking Terminal (NO GREEN LINE!) */}
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900/95 via-[#0b1428] to-[#070d1d] border border-slate-700/80 rounded-2xl p-3.5 shadow-[0_12px_36px_rgba(0,10,30,0.5)] flex flex-col items-center space-y-2.5 relative overflow-hidden">
                {/* Subtle Ambient Top Glow Line */}
                <div className={`absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent ${
                  paymentGateway === 'aba' ? 'via-[#00A3E0]' : 'via-red-500'
                } to-transparent opacity-80`} />
                
                {/* Modern Tri-Spinner & Cycling Dynamic Text Loader (Fintech Grade) */}
                <div className="payment-spinner-container py-1">
                  <div className={`payment-tri-spinner ${paymentGateway === 'aba' ? '' : 'bakong'}`} />
                  
                  <div className="payment-words-loader mt-2.5">
                    <p className="text-slate-200 font-bold tracking-tight">Waiting for</p>
                    <div className="payment-words-box">
                      <span className={`payment-cycle-word ${paymentGateway === 'aba' ? '' : 'bakong'}`}>Payment...</span>
                      <span className={`payment-cycle-word ${paymentGateway === 'aba' ? '' : 'bakong'}`}>
                        {paymentGateway === 'aba' ? 'ABA Mobile...' : 'Bakong App...'}
                      </span>
                      <span className={`payment-cycle-word ${paymentGateway === 'aba' ? '' : 'bakong'}`}>KHQR Scan...</span>
                      <span className={`payment-cycle-word ${paymentGateway === 'aba' ? '' : 'bakong'}`}>Confirmation...</span>
                      <span className={`payment-cycle-word ${paymentGateway === 'aba' ? '' : 'bakong'}`}>Payment...</span>
                    </div>
                  </div>
                  
                  <p className="text-[10.5px] text-slate-400 font-kantumruy mt-0.5 text-center font-medium">
                    សូមបើកកម្មវិធីធនាគាររបស់អ្នកដើម្បីស្កេនទូទាត់ (Scan & Pay)
                  </p>
                </div>

                {/* Telemetry Status & Digital Timer Row (NO GREEN LINE) */}
                <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11.5px] font-bold text-white block leading-tight font-kantumruy">
                        កំពុងរង់ចាំការស្កេនទូទាត់...
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block leading-tight">
                        Auto-Polling Gateway (2s)
                      </span>
                    </div>
                  </div>
                  
                  {/* Digital Clock Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-700/80 font-mono text-xs font-black text-cyan-400 shadow-inner shrink-0">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="tracking-wider">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Sub-footer inside Auto-Checking Card */}
                <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>EMVCo 256-bit Secure</span>
                  </span>
                  <span className="text-slate-400">
                    {paymentGateway === 'aba' ? 'ABA PayWay API' : 'Bakong Open API'}
                  </span>
                </div>
              </div>

              {/* Clean Action Buttons: Back and Save QR Only */}
              <div className="flex items-center justify-between gap-2.5 w-full max-w-sm pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold cursor-pointer transition-colors text-center border border-slate-700 flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ថយក្រោយ (Back)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-98 ${
                    paymentGateway === 'aba'
                      ? 'bg-gradient-to-r from-[#002D56] via-[#004B87] to-[#00A3E0] hover:brightness-110'
                      : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>រក្សាទុកកាត (Save QR)</span>
                </button>
              </div>

            </div>
          )}

          {/* ── STEP 3: Official Ministry Digital Receipt & Sampeah Thank You ── */}
          {step === 3 && !isGeneratingQR && (
            <div className="space-y-2.5 py-1 text-center animate-scaleUp max-w-md mx-auto w-full">
              
              {/* Prestigious Ministry Crest Header */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border-2 border-amber-400/90 shadow-md p-1.5 flex items-center justify-center ring-4 ring-amber-400/20">
                  <img 
                    src="/assets/moeys-crest-transparent.png" 
                    alt="Ministry Crest" 
                    className="w-full h-full object-contain filter drop-shadow-xs"
                    onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold ring-1.5 ring-slate-900">
                    ✓
                  </div>
                </div>
                <h4 className="font-black text-base text-white mt-1.5 flex items-center justify-center gap-1">
                  <span>ការទូទាត់ទទួលបានជោគជ័យ!</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះសប្បុរសជន <strong className="text-white font-bold">{donorName}</strong>
                </p>
              </div>

              {/* Official Ministry Watermarked Receipt Voucher */}
              <div className="relative overflow-hidden bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 text-left shadow-lg space-y-2 text-xs text-white">
                {/* Official Ministry Crest Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.12] overflow-hidden">
                  <img 
                    src="/assets/moeys-crest-transparent.png" 
                    alt="Ministry Watermark" 
                    className="w-52 h-52 object-contain"
                  />
                </div>

                {/* Ministry Receipt Top Banner */}
                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-dashed border-slate-800">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/assets/moeys-crest-transparent.png" 
                      alt="Crest" 
                      className="w-6 h-6 object-contain"
                    />
                    <div>
                      <p className="font-black text-[10.5px] sm:text-[11px] text-white leading-tight">
                        ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
                      </p>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-400 font-mono uppercase tracking-wider">
                        MINISTRY OF TALENT DEVELOPMENT & ADVANCED RESEARCH
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      NO: {Date.now().toString().slice(-6)}
                    </span>
                  </div>
                </div>

                {/* Receipt Line Items */}
                <div className="relative z-10 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">សប្បុរសជន (Benefactor)</span>
                    <span className="font-bold text-white">{donorName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ចំនួនទឹកប្រាក់ (Contribution)</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">{displayAmount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ច្រកទូទាត់ (Payment Gateway)</span>
                    <span className="font-medium text-slate-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {paymentGateway === 'aba' ? 'ABA PayWay (Verified)' : 'Bakong KHQR (NBC Verified)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">កាលបរិច្ឆេទ (Date & Time)</span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {new Date().toLocaleDateString('km-KH')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">លេខកូដយោង (Transaction Ref)</span>
                    <span className="font-mono text-[9.5px] text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {khqrData?.md5 ? `MD5-${khqrData.md5.slice(0, 12).toUpperCase()}` : `TXN-${Date.now().toString().slice(-8)}`}
                    </span>
                  </div>

                  {donorMessage && (
                    <div className="pt-1 border-t border-dashed border-slate-800 text-amber-300 italic bg-amber-950/30 p-1.5 rounded border border-amber-500/30">
                      "{donorMessage}"
                    </div>
                  )}
                </div>

                {/* Ministry Official Stamp & Verified Seal */}
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-dashed border-slate-800 text-[9px] text-slate-400">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>ផ្ទៀងផ្ទាត់ផ្លូវការតាម NBC & MoTDAR</span>
                  </div>
                  <div className="font-mono text-slate-400 font-bold">
                    Developer: @chey_dev
                  </div>
                </div>

              </div>

              {/* XP Reward Notification */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl py-1.5 px-3 font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>ទទួលបាន +500 XP បន្ថែមក្នុងគណនីរបស់អ្នក</span>
              </div>

              {/* Action Button: Done */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-[0.99] border border-slate-700"
              >
                រួចរាល់ (Done)
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
