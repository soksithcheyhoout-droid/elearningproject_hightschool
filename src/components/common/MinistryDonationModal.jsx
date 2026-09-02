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
        isSm ? 'w-5 h-5 rounded-md text-[8.5px]' : 'w-9 h-9 rounded-xl text-[13px]'
      } bg-[#002D56] text-white flex items-center justify-center font-black font-mono tracking-tight shadow-sm flex-shrink-0 select-none border border-white/20 overflow-hidden`}
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
        isSm ? 'w-5 h-5 rounded-md p-0.5' : 'w-9 h-9 rounded-xl p-1.5'
      } bg-[#E21A1A] text-white flex items-center justify-center shadow-sm flex-shrink-0 select-none border border-white/20 overflow-hidden`}
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
  
  // Expiration countdown timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [qrRefreshCount, setQrRefreshCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const usdPresets = [
    { val: 1, label: '$1', title: 'មូលដ្ឋាន', note: 'Basic Support' },
    { val: 3, label: '$3', title: 'គាំទ្រកូដ', note: 'Coding Fuel' },
    { val: 5, label: '$5', title: 'ពេញនិយម', note: 'Dev Fuel', popular: true },
    { val: 10, label: '$10', title: 'Server ១ ខែ', note: 'Cloud Hosting' },
    { val: 25, label: '$25', title: 'AI Tokens', note: 'AI API Cost' },
    { val: 50, label: '$50', title: 'សប្បុរសជន', note: 'VIP Patron' },
  ];

  const khrPresets = [
    { val: 4000, label: '4,000 ៛', title: 'មូលដ្ឋាន', note: 'Basic Support' },
    { val: 12000, label: '12,000 ៛', title: 'គាំទ្រកូដ', note: 'Coding Fuel' },
    { val: 20000, label: '20,000 ៛', title: 'ពេញនិយម', note: 'Dev Fuel', popular: true },
    { val: 40000, label: '40,000 ៛', title: 'Server ១ ខែ', note: 'Cloud Hosting' },
    { val: 100000, label: '100,000 ៛', title: 'AI Tokens', note: 'AI API Cost' },
    { val: 200000, label: '200,000 ៛', title: 'សប្បុរសជន', note: 'VIP Patron' },
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

        // Pre-fetch ABA PayWay QR if ABA is active
        if (paymentGateway === 'aba') {
          generateAbaPaymentQr({
            amount: currentAmount,
            currency: amountType
          }).then(res => {
            if (res && res.success) {
              setAbaData(res);
            }
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('[QR Gen Error]:', e);
      }
    }
  }, [isOpen, paymentGateway, currentAmount, amountType, qrRefreshCount, sessionBillNumber]);

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
        const abaRes = await generateAbaPaymentQr({
          amount: currentAmount,
          currency: amountType
        });
        if (abaRes && abaRes.success) {
          setAbaData(abaRes);
        } else {
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

    const scanAudio = new Audio('/assets/audio/qr-scan-sreymom.mp3?v=2');
    scanAudio.preload = 'auto';
    scanAudio.volume = 1.0;

    setTimeout(() => {
      setIsGeneratingQR(false);
      setStep(2);
      setIsExpired(false);

      try {
        scanAudio.play().catch(() => {});
      } catch (e) {}
    }, 1350);
  };

  const handlePaymentSuccess = () => {
    playSound.correct?.();

    try {
      const successAudio = new Audio('/assets/audio/khmer-payment-sreymom.mp3?v=2');
      successAudio.volume = 1.0;
      successAudio.play().catch(() => {});
    } catch (e) {}

    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#00A3E0', '#002D56', '#10B981', '#F59E0B', '#6366F1']
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
          canvas.height = 860;
          const ctx = canvas.getContext('2d');

          // 1. Pure White Card Background with Rounded Corners
          ctx.fillStyle = '#ffffff';
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(0, 0, 600, 860, 36);
            ctx.fill();
          } else {
            ctx.fillRect(0, 0, 600, 860);
          }

          // 2. Official Header Bar: ABA Deep Navy vs Bakong Red
          const isAba = paymentGateway === 'aba';
          ctx.fillStyle = isAba ? '#002D56' : '#E21A1A';
          ctx.fillRect(0, 0, 600, 96);

          // 3. Header Wordmark: "ABA' PayWay" vs "KHQR"
          ctx.fillStyle = '#ffffff';
          if (isAba) {
            ctx.font = '900 36px monospace, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("ABA' PayWay", 300, 62);
          } else {
            ctx.font = '900 36px monospace, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('KHQR', 300, 62);
          }

          // 4. Triangle Notch on Right
          ctx.beginPath();
          ctx.moveTo(600, 96);
          ctx.lineTo(560, 96);
          ctx.lineTo(600, 136);
          ctx.closePath();
          ctx.fillStyle = isAba ? '#002D56' : '#E21A1A';
          ctx.fill();

          // 5. Merchant Name
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 28px monospace, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('chey_dev', 45, 160);

          // 6. Amount
          ctx.fillStyle = '#0f172a';
          ctx.font = '900 44px monospace, sans-serif';
          const amtText = amountType === 'usd' ? `$${Number(currentAmount).toFixed(2)}` : `${Number(currentAmount).toLocaleString()} KHR`;
          ctx.fillText(amtText, 45, 215);

          // 7. Dashed Divider Line
          ctx.strokeStyle = '#cbd5e1';
          ctx.setLineDash([8, 6]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(45, 245);
          ctx.lineTo(555, 245);
          ctx.stroke();
          ctx.setLineDash([]);

          // 8. Draw QR Code
          ctx.drawImage(image, 60, 275, 480, 480);

          // 9. Center Emblem: ABA Badge vs Bakong Emblem
          if (isAba) {
            // ABA Rect Badge
            ctx.fillStyle = '#002D56';
            if (ctx.roundRect) {
              ctx.beginPath();
              ctx.roundRect(255, 475, 90, 80, 16);
              ctx.fill();
            } else {
              ctx.fillRect(255, 475, 90, 80);
            }
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 30px monospace, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("ABA'", 300, 515);
          } else {
            // Bakong Circle Emblem
            ctx.beginPath();
            ctx.arc(300, 515, 44, 0, Math.PI * 2);
            ctx.fillStyle = '#E21A1A';
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('★', 300, 515);
          }

          // 11. Footer note
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(isAba ? 'Scan with ABA Mobile (Instant PayWay)' : 'Scan with Bakong or any KHQR Banking App', 300, 805);

          const png = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${isAba ? 'ABA_PAYWAY' : 'KHQR'}_CHEY_DEV_${currentAmount}_${amountType.toUpperCase()}.png`;
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenDeepLink = () => {
    playSound.click?.();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn font-kantumruy select-none overflow-y-auto">
      
      {/* Main Modal Card Container */}
      <div className="relative w-full max-w-[880px] bg-[#0A0F1D] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(0,163,224,0.15)] border border-white/[0.08] overflow-hidden animate-scaleUp flex flex-col md:flex-row max-h-[94vh] my-auto text-white">
        
        {/* Floating Close Button for Mobile Only */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden absolute top-3.5 right-3.5 z-50 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
          title="បិទ (Close)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ══════════ MOBILE COMPACT DEVELOPER HEADER (md:hidden) ══════════ */}
        <div className="md:hidden bg-gradient-to-r from-[#0D1424] to-[#0A0F1D] p-3.5 pr-12 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md flex-shrink-0">
              <img
                src="/assets/developer-avatar.jpg"
                alt="chey_dev"
                className="w-full h-full object-cover object-top rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-black ring-1.5 ring-slate-950">
                ✓
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white font-mono truncate">chey_dev</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 font-mono font-bold border border-blue-500/20">
                  DEVELOPER
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">HUT SOKSITCHEY • E-Learning Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
              paymentGateway === 'aba'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                paymentGateway === 'aba' ? 'bg-cyan-400' : 'bg-rose-500'
              }`} />
              <span>{paymentGateway === 'aba' ? 'ABA LIVE' : 'BAKONG'}</span>
            </span>
          </div>
        </div>

        {/* ══════════ DESKTOP DEVELOPER & PATRON SHOWCASE (hidden md:flex) ══════════ */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-b from-[#0D1527] via-[#0A0F1E] to-[#070B16] text-white p-6 sm:p-7 flex-col justify-between relative overflow-hidden flex-shrink-0 border-r border-white/[0.08]">
          
          {/* Subtle Ambient Glow Effects (High-end Modern Design) */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            
            {/* Top Pill & Gateway Status */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/25">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest font-mono">
                  PLATFORM CREATOR
                </span>
              </div>
              
              <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${
                paymentGateway === 'aba'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  paymentGateway === 'aba' ? 'bg-cyan-400' : 'bg-rose-500'
                }`} />
                <span>{paymentGateway === 'aba' ? 'ABA PAYWAY LIVE' : 'BAKONG KHQR'}</span>
              </span>
            </div>

            {/* Clean, Modern Glassmorphism Developer Card */}
            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-center shadow-xl backdrop-blur-md overflow-hidden">
              
              {/* Subtle top card accent line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              {/* Refined Circular Avatar with Sleek Gradient Ring (NO GAMING CROWN) */}
              <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
                <div className="w-full h-full rounded-full p-[2.5px] bg-gradient-to-tr from-blue-600 via-sky-400 to-emerald-400 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 ring-2 ring-slate-900">
                    <img
                      src="/assets/developer-avatar.jpg"
                      alt="HUT SOKSITCHEY (chey_dev)"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Verified Blue Checkmark Badge */}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full ring-2 ring-slate-950 shadow-md flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Developer Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="font-bold text-base text-white font-mono tracking-tight">chey_dev</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                    Verified
                  </span>
                </div>
                
                <div className="text-[11px] font-mono text-slate-400 tracking-wide font-medium">
                  HUT SOKSITCHEY
                </div>
                
                <p className="text-[11.5px] text-slate-300 font-medium pt-1 leading-snug">
                  អ្នកបង្កើតប្រព័ន្ធ E-Learning វិទ្យាល័យជាតិ
                </p>
              </div>

              {/* Clean Tech Badges */}
              <div className="flex items-center justify-center gap-1.5 pt-3 mt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300">
                  Full-Stack
                </span>
                <span className={`px-2 py-0.5 rounded-md border font-medium ${
                  paymentGateway === 'aba'
                    ? 'bg-[#002D56]/40 border-[#00A3E0]/30 text-cyan-300'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                }`}>
                  {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong NBC'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300">
                  AI & Cloud
                </span>
              </div>
            </div>

            {/* Impact & Transparency Feature Cards */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Cloud Hosting & AI Tokens</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    គាំទ្រដំណើរការម៉ាស៊ីនបម្រើ 24/7 និង AI សិក្សាទូទាំងប្រទេស
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">រង្វាន់សប្បុរសជន +500 XP</span>
                    <span className="text-[9px] text-amber-300 font-mono font-bold">+500</span>
                  </div>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    ទទួលបានវិញ្ញាបនបត្រឌីជីថល និងពិន្ទុ XP ភ្លាមៗក្នុងគណនី
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Security Guarantee */}
          <div className="relative z-10 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[10.5px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{paymentGateway === 'aba' ? 'Direct ABA Gateway' : 'National Bakong Gateway'}</span>
            </span>
            <span className="font-mono text-slate-400 font-medium">
              TLS 1.3 / EMVCo
            </span>
          </div>
        </div>

        {/* ══════════ RIGHT INTERACTIVE FORM & HERO KHQR PAYMENT (Main Flow) ══════════ */}
        <div className="flex-1 flex flex-col justify-between bg-[#0B1120] p-4 sm:p-6 overflow-y-auto relative min-h-0 text-white">
          
          {/* Modal Header & Professional Progress Stepper */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="space-y-1">
              {/* Refined Stepper Breadcrumb (NO HARSH RED TEXT) */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                  step === 1 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-500'
                }`}>
                  1. ចំនួនទឹកប្រាក់
                </span>
                <span className="text-slate-600">→</span>
                <span className={`px-2 py-0.5 rounded-full font-bold transition-colors ${
                  step === 2 
                    ? (paymentGateway === 'aba' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30')
                    : 'text-slate-500'
                }`}>
                  2. ស្កេនទូទាត់ QR
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white font-kantumruy">
                {step === 1 
                  ? 'ឧបត្ថម្ភគាំទ្រ Developer (Support Developers)' 
                  : step === 2 
                    ? (paymentGateway === 'aba' ? 'ស្កេនទូទាត់ជាមួយ ABA PayWay KHQR' : 'ស្កេនទូទាត់ជាមួយ Bakong KHQR') 
                    : 'លិខិតថ្លែងអំណរគុណឌីជីថល'}
              </h3>
            </div>
            
            {/* Desktop Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden md:flex w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white items-center justify-center transition-colors cursor-pointer border border-white/[0.08]"
              title="បិទ (Close)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ══════════ HIGH-TECH GATEWAY CONNECTING ANIMATION ══════════ */}
          {isGeneratingQR && (
            <div className="my-auto py-8 flex flex-col items-center justify-center space-y-5 animate-fadeIn">
              
              {/* Interactive Gateway Bridge */}
              <div className="w-full max-w-sm bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 shadow-xl text-center">
                <div className="flex items-center justify-between gap-3 relative">
                  
                  {/* Left Node: chey_dev */}
                  <div className="flex flex-col items-center text-center w-20">
                    <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md">
                      <img src="/assets/developer-avatar.jpg" alt="chey_dev" className="w-full h-full object-cover object-top rounded-full" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold ring-1 ring-slate-950">✓</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-white mt-1.5">chey_dev</span>
                    <span className="text-[8.5px] text-slate-400 font-mono">Developer ID</span>
                  </div>

                  {/* Flow Pulse Center */}
                  <div className="flex-1 flex flex-col items-center justify-center px-2 relative">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                      <div className={`h-full animate-pulse rounded-full ${
                        paymentGateway === 'aba' ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00A3E0]' : 'bg-gradient-to-r from-purple-500 via-rose-500 to-red-500'
                      }`} style={{ width: '100%' }} />
                    </div>
                    <div className="mt-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-[8.5px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Encrypted SSL</span>
                    </div>
                  </div>

                  {/* Right Node: Bank Gateway */}
                  <div className="flex flex-col items-center text-center w-20">
                    {paymentGateway === 'aba' ? (
                      <div className="w-12 h-12 rounded-xl bg-[#002D56] border border-[#00A3E0]/40 flex items-center justify-center shadow-md">
                        <AbaLogoBadge size="lg" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#E21A1A] border border-rose-400/40 flex items-center justify-center shadow-md">
                        <BakongLogoBadge size="lg" />
                      </div>
                    )}
                    <span className={`text-[11px] font-mono font-bold mt-1.5 ${paymentGateway === 'aba' ? 'text-[#00A3E0]' : 'text-rose-400'}`}>
                      {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong NBC'}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-mono">Bank Gateway</span>
                  </div>

                </div>
              </div>

              {/* Progress Steps */}
              <div className="w-full max-w-sm space-y-2 text-left bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
                <div className="flex items-center gap-2.5 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {paymentGateway === 'aba' ? 'ភ្ជាប់ទៅកាន់ ABA Bank PayWay System' : 'ភ្ជាប់ទៅកាន់ National Bakong System'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    genStage >= 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {genStage >= 2 ? '✓' : <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">
                    ផ្ទៀងផ្ទាត់គណនី @chey_dev ({displayAmount})
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    genStage >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {genStage >= 3 ? '✓' : <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">
                    បង្កើតកាត KHQR ផ្លូវការ
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ══════════ STEP 1: Select Amount & Gateway ══════════ */}
          {step === 1 && !isGeneratingQR && (
            <div className="space-y-4 py-2 animate-fadeIn">
              
              {/* Payment Gateway Toggle: ABA PayWay vs Bakong */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>ជ្រើសរើសច្រកទូទាត់ (Payment Method)៖</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: ABA PayWay */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('aba')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                      paymentGateway === 'aba'
                        ? 'bg-[#002D56]/60 border-2 border-[#00A3E0] shadow-[0_0_20px_rgba(0,163,224,0.25)] ring-1 ring-[#00A3E0]'
                        : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <AbaLogoBadge size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">ABA PayWay</span>
                        <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#00A3E0]/20 text-cyan-300 font-bold border border-[#00A3E0]/30 font-mono">
                          1-Click
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">Direct ABA Mobile</span>
                    </div>
                    {paymentGateway === 'aba' && (
                      <div className="w-4 h-4 rounded-full bg-[#00A3E0] text-slate-950 flex items-center justify-center text-[9px] font-black">
                        ✓
                      </div>
                    )}
                  </button>

                  {/* Option 2: Bakong KHQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('bakong')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                      paymentGateway === 'bakong'
                        ? 'bg-rose-950/50 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] ring-1 ring-rose-500'
                        : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <BakongLogoBadge size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">Bakong KHQR</span>
                        <span className="text-[8px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 font-mono">
                          All Banks
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">National NBC System</span>
                    </div>
                    {paymentGateway === 'bakong' && (
                      <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black">
                        ✓
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Currency Selector (USD vs KHR) */}
              <div className="flex items-center p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAmountType('usd'); setSelectedTier(5); setCustomAmount(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    amountType === 'usd'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ប្រាក់ដុល្លារ (USD $)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAmountType('khr'); setSelectedTier(20000); setCustomAmount(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    amountType === 'khr'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono font-bold text-rose-300 text-[10.5px]">KHR</span>
                  <span>ប្រាក់រៀល (KHR ៛)</span>
                </button>
              </div>

              {/* Amount Tiers Grid */}
              <div className="space-y-1.5">
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
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[62px] ${
                          isSelected
                            ? paymentGateway === 'aba'
                              ? 'bg-[#002D56] border-2 border-[#00A3E0] text-white shadow-md'
                              : 'bg-rose-950 border-2 border-rose-500 text-white shadow-md'
                            : 'bg-white/[0.02] border border-white/[0.08] text-white hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        {tier.popular && (
                          <span className={`absolute top-0 right-0 font-black text-[7.5px] px-1.5 py-0.2 rounded-bl-md uppercase tracking-wider ${
                            paymentGateway === 'aba' ? 'bg-[#00A3E0] text-slate-950' : 'bg-rose-500 text-white'
                          }`}>
                            Popular
                          </span>
                        )}
                        <span className="font-mono font-bold text-sm leading-none text-white">
                          {tier.label}
                        </span>
                        <span className={`text-[9.5px] font-medium mt-1 leading-none ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {tier.title}
                        </span>
                        <span className={`text-[8px] font-mono mt-0.5 leading-none ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {tier.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
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
                    className="w-full pl-3.5 pr-16 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0] text-xs font-bold text-white transition-all font-mono placeholder:text-slate-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-mono">
                    {amountType === 'usd' ? 'USD ($)' : 'KHR'}
                  </span>
                </div>
              </div>

              {/* Donor Name & Support Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-medium text-slate-400 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>ឈ្មោះអ្នកឧបត្ថម្ភ៖</span>
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0]"
                    placeholder="ឈ្មោះរបស់អ្នក"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-medium text-slate-400 block mb-0.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-500" />
                    <span>សារលើកទឹកចិត្ត (Message)៖</span>
                  </label>
                  <input
                    type="text"
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00A3E0] focus:ring-1 focus:ring-[#00A3E0]"
                    placeholder="សារជូនពរ ឬលើកទឹកចិត្ត..."
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="button"
                onClick={handleProceedToQR}
                className={`w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${
                  paymentGateway === 'aba'
                    ? 'bg-gradient-to-r from-[#002D56] via-[#004B87] to-[#00A3E0] hover:brightness-110 shadow-blue-900/30'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 shadow-red-900/30'
                }`}
              >
                <span>បន្តទៅស្កេនទូទាត់ជាមួយ {paymentGateway === 'aba' ? 'ABA PayWay' : 'Bakong'} ({displayAmount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ══════════ STEP 2: Authentic, World-Class KHQR Payment Card (THE HERO VIEW) ══════════ */}
          {step === 2 && !isGeneratingQR && (
            <div className="space-y-3 py-1 flex flex-col items-center justify-center animate-fadeIn">
              
              {/* Authentic NBC Pure White KHQR Stand Card - Enhanced Large Size (310px-330px) */}
              <div className="rounded-[24px] w-[310px] sm:w-[330px] flex flex-col bg-white shadow-[0_30px_70px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden text-slate-900 relative mx-auto transition-transform hover:scale-[1.01]">
                
                {/* Official Header Bar: ABA Deep Navy vs Bakong Red */}
                <div 
                  className="relative h-[46px] flex items-center justify-center shadow-xs transition-colors"
                  style={{ backgroundColor: paymentGateway === 'aba' ? '#002D56' : '#E21A1A' }}
                >
                  {paymentGateway === 'aba' ? (
                    /* Official ABA PayWay Logo Wordmark */
                    <div className="flex items-center gap-1 font-black text-white font-mono tracking-tight select-none">
                      <span className="text-lg font-black tracking-tight">ABA</span>
                      <span className="text-[#00A3E0] text-xl font-black -ml-0.5 -mt-0.5">'</span>
                      <span className="text-sm text-white/95 ml-1.5 font-sans font-bold tracking-normal">PayWay</span>
                    </div>
                  ) : (
                    /* Official KHQR Vector Logo */
                    <svg width="72" height="17" viewBox="0 0 60 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M39.006 5.19439V9.59764H34.5318C34.0729 9.59764 33.7288 9.2307 33.7288 8.80731V5.22264C33.7288 4.77103 34.1016 4.43231 34.5318 4.43231H38.1743C38.6619 4.40408 39.006 4.74278 39.006 5.19439Z" fill="white"/>
                      <path d="M59.9717 6.97176H57.7345C57.7345 4.34676 55.5548 2.20159 52.8875 2.20159C50.7651 2.20159 48.9008 3.55645 48.2699 5.53225C48.1265 6.01209 48.0404 6.49192 48.0404 6.97176V13.9718H47.9831C46.7785 13.9718 45.8033 13.0121 45.8033 11.8266V6.97176H45.832C45.832 5.05241 46.6351 3.21773 48.0691 1.89112C49.3884 0.677406 51.1093 0 52.9162 0C56.8168 0 59.9717 3.13305 59.9717 6.97176Z" fill="white"/>
                      <path d="M59.9999 13.9718L56.845 14L56.0706 13.2379L54.3497 11.5444L51.9692 9.20166H55.1241L59.9999 13.9718Z" fill="white"/>
                      <path d="M39.7517 11.7702H33.0117C32.1799 11.7702 31.5203 11.121 31.5203 10.3024V3.66936C31.5203 2.85081 32.1799 2.20159 33.0117 2.20159H39.7517C40.5834 2.20159 41.2431 2.85081 41.2431 3.66936V10.3024L43.4802 12.504V2.14515C43.4802 0.959671 42.505 0 41.3005 0H31.4629C30.2583 0 29.2832 0.959671 29.2832 2.14515V11.8266C29.2832 13.0121 30.2583 13.9718 31.4629 13.9718H41.9888L39.7517 11.7702Z" fill="white"/>
                      <path d="M12.3614 14H9.20656L2.60996 7.47984V14H0V0H2.60996V6.2379L8.94843 0H12.046L5.16255 6.71772L12.3614 14Z" fill="white"/>
                      <path d="M24.1492 0H26.7018V14H24.1492V7.93145H16.8643V14H14.3117V0H16.8643V5.84273H24.1492V0Z" fill="white"/>
                    </svg>
                  )}
                </div>

                {/* Authentic 45° Angle Notch Fold on Right */}
                <div className="flex justify-end -mt-[0.5px]">
                  <div style={{
                    borderLeft: '18px solid transparent',
                    borderTop: `18px solid ${paymentGateway === 'aba' ? '#002D56' : '#E21A1A'}`,
                    height: 0,
                    width: 0
                  }} />
                </div>

                {/* Merchant Name & Amount on Clean Pure White Card */}
                <div className="px-5 pt-1.5 pb-2 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-slate-900 font-mono tracking-wider uppercase">
                        chey_dev
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                    </div>

                    <span className={`text-[9.5px] px-2.5 py-0.5 rounded-md font-mono font-black ${
                      paymentGateway === 'aba'
                        ? 'bg-[#002D56] text-white shadow-xs'
                        : 'bg-red-100 text-[#E21A1A] border border-red-200'
                    }`}>
                      {paymentGateway === 'aba' ? 'ABA PAYWAY' : 'BAKONG KHQR'}
                    </span>
                  </div>

                  {/* Financial Amount Typography */}
                  <div className="mt-1 flex items-baseline justify-between">
                    <div className="font-mono flex items-baseline">
                      <span className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                        {amountType === 'usd' ? `$${Number(currentAmount).toFixed(2)}` : `${Number(currentAmount).toLocaleString()} ៛`}
                      </span>
                      <span className="text-[10.5px] font-black text-slate-500 uppercase ml-1.5 font-mono">
                        {amountType.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[10px] font-black text-emerald-600 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Zero Fee
                    </span>
                  </div>
                </div>

                {/* Perforated Dashed Divider Line */}
                <div className="mx-5 border-b border-dashed border-slate-200" />

                {/* Large QR Code Canvas Area directly on Pure White Card */}
                <div className="relative px-4 py-3 flex flex-col items-center justify-center khqr-svg-wrapper">
                  
                  {/* Laser Beam Scan Animation */}
                  <div className={`qr-scan-beam-anim ${paymentGateway === 'aba' ? '' : 'bakong'}`} />

                  <div className="relative p-1 bg-white flex items-center justify-center rounded-xl">
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
                              billNumber: sessionBillNumber,
                              storeLabel: 'chey_dev'
                            }).qrString)
                      }
                      size={220}
                      level="H"
                      marginSize={1}
                      fgColor={paymentGateway === 'aba' ? '#002D56' : '#000000'}
                      bgColor="#ffffff"
                    />

                    {/* DYNAMIC CENTER EMBLEM: ABA Logo Badge vs Bakong NBC Emblem */}
                    {paymentGateway === 'aba' ? (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-[#002D56] shadow-md border-[2.5px] border-white flex items-center justify-center pointer-events-none ring-1 ring-black/10 select-none">
                        <span className="font-mono font-black text-white text-[13px] tracking-tight">ABA</span>
                        <span className="font-mono font-black text-[#00A3E0] text-[15px] -ml-[0.5px] -mt-[1px]">'</span>
                      </div>
                    ) : (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#E21A1A] p-1.5 shadow-md border-[2.5px] border-white flex items-center justify-center pointer-events-none ring-1 ring-black/10">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.6" strokeDasharray="2 1.5"/>
                          <path d="M12 4.5L15 9.5H9L12 4.5Z" fill="white"/>
                          <path d="M12 19.5L9 14.5H15L12 19.5Z" fill="white"/>
                          <path d="M4.5 12L9.5 9V15L4.5 12Z" fill="white"/>
                          <path d="M19.5 12L14.5 15V9L19.5 12Z" fill="white"/>
                          <circle cx="12" cy="12" r="2.2" fill="white"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Expired Overlay */}
                  {isExpired && (
                    <div className="absolute inset-2 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 rounded-xl">
                      <AlertCircle className="w-8 h-8 text-amber-400 mb-1.5" />
                      <p className="text-sm font-bold text-white">កាត QR ផុតកំណត់</p>
                      <p className="text-xs text-slate-400 mb-3">សូមចុចបង្កើតកាតថ្មី</p>
                      <button
                        type="button"
                        onClick={handleProceedToQR}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        បង្កើតកាតថ្មី (Refresh)
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Subtitle */}
                <div className="pb-3 pt-0 text-center px-4">
                  <p className="text-[10.5px] text-slate-500 font-medium leading-tight">
                    {paymentGateway === 'aba' ? (
                      <span>ស្កេនជាមួយ <strong className="text-[#002D56] font-black">ABA Mobile</strong> (Instant PayWay)</span>
                    ) : (
                      <span>ស្កេនជាមួយ <strong className="text-[#E21A1A] font-black">Bakong</strong> ឬ KHQR គ្រប់ធនាគារ</span>
                    )}
                  </p>
                </div>
              </div>

              {/* ══════════ MODERN FINTECH STATUS RADAR ══════════ */}
              <div className="w-full max-w-[310px] sm:max-w-[330px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 shadow-md flex items-center justify-between">
                
                {/* Radar Pulse & Status Text */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-7 h-7 flex items-center justify-center flex-shrink-0">
                    <div className={`payment-radar-ring ${paymentGateway === 'aba' ? '' : 'bakong'}`} />
                    <div className={`payment-radar-ring ${paymentGateway === 'aba' ? '' : 'bakong'}`} />
                    <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block leading-tight truncate">
                      រង់ចាំការស្កេនទូទាត់...
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono block">
                      Auto-checking live
                    </span>
                  </div>
                </div>

                {/* Digital Countdown Timer */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 font-mono text-[11px] font-bold text-cyan-400 shadow-inner flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Direct Deep Link Action Controls (Official abamobilebank:// & bakong://) */}
              <div className="w-full max-w-[310px] sm:max-w-[330px] flex flex-col gap-2">
                {paymentGateway === 'aba' ? (
                  /* Primary Official ABA Mobile Deep Link Button */
                  <a
                    href={
                      abaData?.deepLink ||
                      `abamobilebank://ababank.com?type=payway&qrcode=${encodeURIComponent(
                        abaData?.qrString || khqrData?.qrString || ''
                      )}`
                    }
                    onClick={handleOpenDeepLink}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#002D56] via-[#004B87] to-[#00A3E0] hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border border-[#00A3E0]/50 shadow-md active:scale-98 cursor-pointer select-none text-center"
                  >
                    <Smartphone className="w-4 h-4 text-cyan-300" />
                    <span>បើកក្នុង ABA Mobile (Deep Link)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
                  </a>
                ) : (
                  /* Bakong Deep Link Button */
                  <a
                    href={`bakong://qr?payload=${encodeURIComponent(khqrData?.qrString || '')}`}
                    onClick={handleOpenDeepLink}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border border-red-400/40 shadow-md active:scale-98 cursor-pointer select-none text-center"
                  >
                    <Smartphone className="w-4 h-4 text-white" />
                    <span>បើកក្នុង Bakong App (Deep Link)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                )}
              </div>

              {/* Action Buttons: Back & Save QR */}
              <div className="flex items-center justify-between gap-2.5 w-full max-w-[310px] sm:max-w-[330px] pt-0.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-bold cursor-pointer transition-colors text-center border border-white/[0.08] flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ថយក្រោយ</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-98 ${
                    paymentGateway === 'aba'
                      ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:brightness-110'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>រក្សាទុកកាត (Save QR)</span>
                </button>
              </div>

            </div>
          )}

          {/* ══════════ STEP 3: Prestigious Digital Receipt Voucher ══════════ */}
          {step === 3 && !isGeneratingQR && (
            <div className="space-y-3 py-2 text-center animate-scaleUp max-w-md mx-auto w-full">
              
              {/* Success Emblem */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-xl p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h4 className="font-bold text-base text-white mt-2">
                  ការទូទាត់ទទួលបានជោគជ័យ!
                </h4>
                <p className="text-xs text-slate-400">
                  សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះសប្បុរសជន <strong className="text-white">{donorName}</strong>
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-left shadow-lg space-y-2.5 text-xs text-white">
                
                {/* Header Banner */}
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-white/10">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/assets/moeys-crest-transparent.png" 
                      alt="Crest" 
                      className="w-6 h-6 object-contain"
                    />
                    <div>
                      <p className="font-bold text-[11px] text-white leading-tight">
                        លិខិតថ្លែងអំណរគុណឌីជីថល
                      </p>
                      <p className="text-[8.5px] text-slate-400 font-mono">
                        E-LEARNING RESEARCH & TALENT FUND
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                    NO: {Date.now().toString().slice(-6)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">សប្បុរសជន (Patron)</span>
                    <span className="font-bold text-white">{donorName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ចំនួនទឹកប្រាក់ (Contribution)</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">{displayAmount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ច្រកទូទាត់ (Gateway)</span>
                    <span className="text-slate-200 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {paymentGateway === 'aba' ? 'ABA PayWay (Verified)' : 'Bakong KHQR (NBC Verified)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">កាលបរិច្ឆេទ (Date)</span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {new Date().toLocaleDateString('km-KH')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {donorMessage && (
                    <div className="pt-1.5 border-t border-dashed border-white/10 text-amber-300/90 italic bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-[10.5px]">
                      "{donorMessage}"
                    </div>
                  )}
                </div>

                {/* Footer Seal */}
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-white/10 text-[9px] text-slate-400">
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NBC KHQR Verified System</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    Developer: @chey_dev
                  </div>
                </div>

              </div>

              {/* XP Notification */}
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-3 font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>ទទួលបាន +500 XP បន្ថែមក្នុងគណនីរបស់អ្នក!</span>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition-all shadow-sm cursor-pointer border border-white/10"
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
