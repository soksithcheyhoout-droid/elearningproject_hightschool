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
      <div className="bg-[#001736] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 text-white shadow-xl border border-white/15 relative overflow-hidden w-full">
        
        {/* Academic Campus Background Image with Balanced Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="/assets/education/modern-campus.jpg"
            alt="Education Campus Background"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00142e]/95 via-[#00224d]/90 to-[#002d62]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00142e]/90 via-transparent to-transparent" />
        </div>

        {/* Ministry Crest Watermark */}
        <div className="absolute -right-10 sm:right-[10%] top-1/2 -translate-y-1/2 w-48 sm:w-80 md:w-96 h-48 sm:h-80 md:h-96 pointer-events-none select-none opacity-10 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full min-w-0">
          
          {/* Left Column: Heading, Subtitle & Primary Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 min-w-0">
            
            {/* Official National Institutional Accreditation Badge */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-[11px] sm:text-xs text-amber-300 font-semibold shadow-xs">
                <img
                  src="/assets/moeys-crest-transparent.png"
                  alt="Ministry Crest"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-bold truncate">
                  {lang === 'km' 
                    ? 'ក្រសួងអប់រំ យុវជន និងកីឡា • ប្រព័ន្ធសិក្សាឌីជីថលថ្នាក់ជាតិ' 
                    : 'Ministry of Education, Youth and Sport • National Portal'}
                </span>
              </div>
              <span className="bg-white/10 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10 hidden sm:inline-flex">
                {lang === 'km' ? 'ថ្នាក់ទី១០ ទី១១ ទី១២' : 'Grades 10–12'}
              </span>
            </div>

            {/* Main Title & Description */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-white leading-tight tracking-tight">
                {t('heroTitle') || (lang === 'km' ? 'មជ្ឈមណ្ឌលសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ' : 'National Secondary E-Learning Portal')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed max-w-xl font-normal">
                {t('heroDesc')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartLearning}
                className="px-6 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>{t('startLearning') || (lang === 'km' ? 'ចូលរៀនតាមមុខវិជ្ជា' : 'Start Learning')}</span>
              </button>
              
              <button
                type="button"
                onClick={onExploreBacII}
                className="bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{t('exploreBacII') || (lang === 'km' ? 'ទាញយកវិញ្ញាសាបាក់ឌុប' : 'Explore BacII Papers')}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Institutional Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/10 max-w-lg text-xs text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">35,000+</p>
                  <p className="text-[9px] sm:text-[10.5px] text-slate-300 mt-1 truncate">{lang === 'km' ? 'សិស្សទូទាំងប្រទេស' : 'Students'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <BookCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">100%</p>
                  <p className="text-[9px] sm:text-[10.5px] text-slate-300 mt-1 truncate">{lang === 'km' ? 'សៀវភៅពុម្ពផ្លូវការ' : 'Official Curriculum'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-white font-cinzel text-xs sm:text-sm leading-none truncate">{lang === 'km' ? 'និទ្ទេស A' : 'Grade A'}</p>
                  <p className="text-[9px] sm:text-[10.5px] text-slate-300 mt-1 truncate">{lang === 'km' ? 'អត្រាខ្ពស់' : 'High Pass Rate'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean BacII Countdown & Stream Hub Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#001f42]/90 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-white/15 space-y-4 w-full overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2 min-w-0">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-amber-300 min-w-0">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{lang === 'km' ? 'រាប់ថយក្រោយការប្រឡងបាក់ឌុប' : 'BacII Exam Countdown'}</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono shrink-0">
                  {lang === 'km' ? '១០-១១ សីហា' : 'Aug 10–11'}
                </span>
              </div>

              {/* 4 Clean Countdown Boxes */}
              <div className="grid grid-cols-4 gap-2 w-full">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5 text-center">
                  <div className="font-black text-lg sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.days}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-wider">
                    {t('days')}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5 text-center">
                  <div className="font-black text-lg sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-wider">
                    {t('hours')}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5 text-center">
                  <div className="font-black text-lg sm:text-2xl text-amber-300 font-cinzel leading-none">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-wider">
                    {t('minutes')}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5 text-center">
                  <div className="font-black text-lg sm:text-2xl text-sky-400 font-cinzel leading-none">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-wider">
                    {t('seconds')}
                  </div>
                </div>
              </div>

              {/* Segmented Stream Switcher */}
              <div className="space-y-2.5 pt-1 border-t border-white/10">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  {lang === 'km' ? 'មុខវិជ្ជាគោលតាមផ្នែក (Focus Subjects):' : 'Core Stream Subjects:'}
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#00132b] rounded-xl border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveHeroStream('science')}
                    className={`py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                      activeHeroStream === 'science'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span className="truncate">{lang === 'km' ? 'វិទ្យាសាស្ត្រពិត' : 'Science'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHeroStream('social')}
                    className={`py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                      activeHeroStream === 'social'
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">{lang === 'km' ? 'វិទ្យាសាស្ត្រសង្គម' : 'Social'}</span>
                  </button>
                </div>

                {/* Core subjects list */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activeHeroStream === 'science' ? (
                    <>
                      <span className="bg-white/5 text-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'គណិតវិទ្យា (១២៥)' : 'Math (125)'}
                      </span>
                      <span className="bg-white/5 text-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'រូបវិទ្យា (៧៥)' : 'Physics (75)'}
                      </span>
                      <span className="bg-white/5 text-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'គីមីវិទ្យា (៧៥)' : 'Chemistry (75)'}
                      </span>
                      <span className="bg-white/5 text-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'ជីវវិទ្យា (៧៥)' : 'Biology (75)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white/5 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'អក្សរសាស្ត្រ (១២៥)' : 'Khmer Lit (125)'}
                      </span>
                      <span className="bg-white/5 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'ប្រវត្តិវិទ្យា (៧៥)' : 'History (75)'}
                      </span>
                      <span className="bg-white/5 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'ភូមិវិទ្យា (៧៥)' : 'Geography (75)'}
                      </span>
                      <span className="bg-white/5 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-white/10">
                        {lang === 'km' ? 'សីលធម៌ (៧៥)' : 'Civics (75)'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs gap-2 min-w-0">
                <span className="text-slate-300 font-medium text-[10.5px] flex items-center gap-1.5 min-w-0 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{lang === 'km' ? 'សិស្សកំពុងរៀន៖ ១,៤២០ នាក់' : 'Active Students: 1,420'}</span>
                </span>
                <button
                  type="button"
                  onClick={onExploreBacII}
                  className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer transition-colors text-xs"
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

