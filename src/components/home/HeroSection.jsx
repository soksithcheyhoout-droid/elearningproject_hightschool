import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Play, 
  FileText, 
  Award, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Users, 
  BookCheck, 
  ShieldCheck, 
  Building2, 
  Atom, 
  Landmark,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection({ onStartLearning, onExploreBacII }) {
  const { t, lang } = useLanguage();
  const { student, selectedStream } = useAuth();

  // Calculate live countdown to upcoming August 10, 07:00 AM (BacII Exam Date)
  const getExamTargetDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Month is 0-indexed: 7 = August (ខែសីហា), Day 10, 07:00 AM
    let target = new Date(currentYear, 7, 10, 7, 0, 0);
    if (now.getTime() > target.getTime()) {
      target = new Date(currentYear + 1, 7, 10, 7, 0, 0);
    }
    return target;
  };

  const calculateTimeLeft = () => {
    const target = getExamTargetDate();
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [activeHeroStream, setActiveHeroStream] = useState('science'); // 'science' | 'social'

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 font-kantumruy">
      
      {/* Main Official MoTDAR Hero Banner */}
      <div className="bg-[#001a38] rounded-2xl sm:rounded-3xl p-3 sm:p-7 lg:p-10 text-white shadow-xl border border-white/15 relative overflow-hidden w-full">
        
        {/* Real Education Academic Campus Background Image with Luxury Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="/assets/education/modern-campus.jpg"
            alt="Education Campus Background"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          {/* Royal Navy & Blue Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00142e]/95 via-[#002654]/85 to-[#003d7a]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00142e]/90 via-transparent to-transparent" />
        </div>

        {/* Ambient Gradient Lighting Orbs */}
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Watermark Logo in Banner Background */}
        <div className="absolute -right-10 sm:right-[12%] md:right-[16%] top-1/2 -translate-y-1/2 w-32 sm:w-80 h-32 sm:h-80 md:w-96 md:h-96 pointer-events-none select-none opacity-10 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center w-full min-w-0">
          
          {/* Left Column: Heading, Subtitle & Primary Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 min-w-0">
            
            {/* National Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-full border border-white/20 text-[10px] sm:text-xs font-bold text-amber-300 shadow-2xs shrink-0">
                <img
                  src="/assets/moeys-crest-transparent.png"
                  alt="Ministry Crest"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
                />
                <span className="truncate max-w-[240px] sm:max-w-none">{t('ministryName') || (lang === 'km' ? 'ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់' : 'Ministry of Talent Development & Advanced Research')}</span>
              </div>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-amber-300 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                {lang === 'km' ? 'BETA TEST v2.5' : 'BETA TESTING v2.5'}
              </span>
              <span className="bg-white/15 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full border border-white/20 hidden sm:inline-flex">
                {lang === 'km' ? 'ថ្នាក់ទី១០ ទី១១ ទី១២' : 'Grades 10, 11, 12'}
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-1.5 sm:space-y-2.5">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {t('heroTitle') || (lang === 'km' ? 'មជ្ឈមណ្ឌលសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ' : 'National Secondary E-Learning Portal')}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl font-medium line-clamp-3 sm:line-clamp-none">
                {t('heroDesc')}
              </p>
            </div>

            {/* Action Buttons (Full width stacked on mobile, row on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={onStartLearning}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-400/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{t('startLearning') || (lang === 'km' ? 'ចូលរៀនតាមមុខវិជ្ជា' : 'Start Learning')}</span>
              </button>
              
              <button
                type="button"
                onClick={onExploreBacII}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all border border-white/25 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{t('exploreBacII') || (lang === 'km' ? 'ទាញយកវិញ្ញាសាបាក់ឌុប' : 'Explore BacII Papers')}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Institutional Stats */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-3 sm:pt-4 border-t border-white/15 max-w-lg text-xs text-white">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">35,000+</p>
                  <p className="text-[8.5px] sm:text-[10px] text-blue-200 mt-0.5 truncate">{lang === 'km' ? 'សិស្សទូទាំងប្រទេស' : 'Students'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <BookCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">100%</p>
                  <p className="text-[8.5px] sm:text-[10px] text-blue-200 mt-0.5 truncate">{lang === 'km' ? 'សៀវភៅពុម្ពផ្លូវការ' : 'Official'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">{lang === 'km' ? 'និទ្ទេស A' : 'Grade A'}</p>
                  <p className="text-[8.5px] sm:text-[10px] text-blue-200 mt-0.5 truncate">{lang === 'km' ? 'អត្រាខ្ពស់' : 'High Pass'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Royal Navy Glass Countdown & Stream Hub Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 shadow-2xl border border-white/20 space-y-2 sm:space-y-4 w-full overflow-hidden">
              
              {/* Card Header with August 10-11 Exam Date */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2 sm:pb-3 gap-2 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 font-extrabold text-[10px] sm:text-[13px] text-amber-300 min-w-0">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{lang === 'km' ? 'រាប់ថយក្រោយការប្រឡងបាក់ឌុប' : 'BacII Exam Countdown'}</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono shadow-2xs shrink-0">
                  {lang === 'km' ? '១០-១១ សីហា' : 'Aug 10-11'}
                </span>
              </div>

              {/* 4 Clean Countdown Boxes */}
              <div className="grid grid-cols-4 gap-0.5 sm:gap-2 w-full">
                <div className="bg-white/10 border border-white/15 rounded-lg sm:rounded-2xl p-1.5 sm:p-2.5 text-center shadow-2xs">
                  <div className="font-black text-base sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.days}
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-blue-200 font-bold mt-1 uppercase tracking-wider">
                    {t('days')}
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-lg sm:rounded-2xl p-1.5 sm:p-2.5 text-center shadow-2xs">
                  <div className="font-black text-base sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-blue-200 font-bold mt-1 uppercase tracking-wider">
                    {t('hours')}
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-lg sm:rounded-2xl p-1.5 sm:p-2.5 text-center shadow-2xs">
                  <div className="font-black text-base sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-blue-200 font-bold mt-1 uppercase tracking-wider">
                    {t('minutes')}
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-lg sm:rounded-2xl p-1.5 sm:p-2.5 text-center shadow-2xs">
                  <div className="font-black text-base sm:text-2xl text-sky-400 font-cinzel leading-none">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-blue-200 font-bold mt-1 uppercase tracking-wider">
                    {t('seconds')}
                  </div>
                </div>
              </div>

              {/* Stream Switcher */}
              <div className="space-y-2 pt-1 border-t border-white/15">
                <label className="text-[10.5px] sm:text-[11px] font-bold text-blue-200 block">
                  {lang === 'km' ? 'មុខវិជ្ជាគោលតាមផ្នែក (Focus Subjects):' : 'Core Stream Subjects:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveHeroStream('science')}
                    className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                      activeHeroStream === 'science'
                        ? 'bg-blue-500/30 text-white border-blue-400 font-extrabold shadow-sm ring-1 ring-blue-400/40'
                        : 'bg-white/5 text-blue-200 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{lang === 'km' ? 'វិទ្យាសាស្ត្រពិត' : 'Science Stream'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHeroStream('social')}
                    className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                      activeHeroStream === 'social'
                        ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-extrabold shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-white/5 text-amber-200/80 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{lang === 'km' ? 'វិទ្យាសាស្ត្រសង្គម' : 'Social Sciences'}</span>
                  </button>
                </div>

                {/* Core subjects badge list */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 overflow-hidden">
                  {activeHeroStream === 'science' ? (
                    <>
                      <span className="bg-white/10 text-blue-100 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'គណិតវិទ្យា (១២៥)' : 'Mathematics (125)'}
                      </span>
                      <span className="bg-white/10 text-blue-100 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'រូបវិទ្យា (៧៥)' : 'Physics (75)'}
                      </span>
                      <span className="bg-white/10 text-blue-100 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'គីមីវិទ្យា (៧៥)' : 'Chemistry (75)'}
                      </span>
                      <span className="bg-white/10 text-blue-100 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'ជីវវិទ្យា (៧៥)' : 'Biology (75)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white/10 text-amber-200 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'អក្សរសាស្ត្រ (១២៥)' : 'Khmer Lit (125)'}
                      </span>
                      <span className="bg-white/10 text-amber-200 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'ប្រវត្តិវិទ្យា (៧៥)' : 'History (75)'}
                      </span>
                      <span className="bg-white/10 text-amber-200 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'ភូមិវិទ្យា (៧៥)' : 'Geography (75)'}
                      </span>
                      <span className="bg-white/10 text-amber-200 text-[8.5px] sm:text-[10.5px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-lg border border-white/15">
                        {lang === 'km' ? 'សីលធម៌ (៧៥)' : 'Civics (75)'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[9px] sm:text-xs gap-2 min-w-0">
                <span className="text-blue-200 font-bold text-[9px] sm:text-[11px] flex items-center gap-1 min-w-0 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{lang === 'km' ? 'កំពុងរៀន៖ ១,៤២០ នាក់' : 'Active Students: 1,420'}</span>
                </span>
                <button
                  type="button"
                  onClick={onExploreBacII}
                  className="text-amber-300 hover:text-amber-200 font-black flex items-center gap-1 cursor-pointer transition-colors text-xs"
                >
                  <span>{lang === 'km' ? 'មើលវិញ្ញាសា' : 'View Papers'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

