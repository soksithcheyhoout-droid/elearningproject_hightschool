import React, { useState, useEffect } from 'react';
import { Shield, Swords, Heart, Star, ChevronRight, Flame, Crown, Sparkles } from 'lucide-react';

// ──────────────────────────────────────────────────────────
// 🇰🇭 KHMER PRIDE 2026 – Clear Waving Cambodian Flag Background
// ──────────────────────────────────────────────────────────

const LOCAL_FLAG_GIF = '/assets/cambodia-flag.gif';
const FALLBACK_FLAG_GIF = 'https://media1.tenor.com/m/kDXhibIv45EAAAAC/cambodia-cambodia-flag.gif';

export default function KhmerPrideSection() {
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory(prev => (prev + 1) % stories.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const stories = [
    {
      title: 'កម្ពុជាក្រោម នៅតែជាដីខ្មែរ',
      titleEn: 'Kampuchea Krom Forever Khmer',
      desc: 'ទឹកដីកម្ពុជាក្រោមជាដីបុព្វបុរសខ្មែរដែលមិនអាចបំភ្លេចបាន។ បងប្អូនខ្មែរក្រោមរាប់លាននាក់នៅតែរក្សាភាសា វប្បធម៌ និងអត្តសញ្ញាណជាតិខ្មែរយ៉ាងរឹងមាំ។',
      icon: '🏛️',
      accent: '#38bdf8',
      bg: 'from-blue-900/90 via-slate-900/90 to-blue-950/90'
    },
    {
      title: 'ការការពារទឹកដី និងអធិបតេយ្យភាព ២០២៦',
      titleEn: 'Defending Khmer Sovereignty 2026',
      desc: 'ស្មារតីសាមគ្គីភាពជាតិខ្មែរ ២០២៦ ក្នុងការការពារបូរណភាពទឹកដី ព្រំដែន និងកិត្តិយសជាតិ។ ទឹកដីខ្មែរមួយចំអាមក៏មិនឱ្យបាត់បង់!',
      icon: '⚔️',
      accent: '#f87171',
      bg: 'from-red-900/90 via-slate-900/90 to-red-950/90'
    },
    {
      title: 'ប្រាសាទព្រះវិហារ និងបេតិកភណ្ឌដូនតា',
      titleEn: 'Preah Vihear Temple & Sacred Heritage',
      desc: 'តុលាការយុត្តិធម៌អន្តរជាតិ (ICJ) បានសម្រេចជាប្រវត្តិសាស្ត្រថា ប្រាសាទព្រះវិហារជាកម្មសិទ្ធិស្របច្បាប់ផ្តាច់មុខរបស់ព្រះរាជាណាចក្រកម្ពុជា។',
      icon: '🏯',
      accent: '#fbbf24',
      bg: 'from-amber-900/90 via-slate-900/90 to-amber-950/90'
    },
    {
      title: 'កម្លាំងយុវជនខ្មែរស្នេហាជាតិ',
      titleEn: 'Patriotic Spirit of Khmer Youth',
      desc: 'យុវជនជំនាន់ថ្មីបន្តវេនការពារ និងអភិវឌ្ឍន៍មាតុភូមិ ដោយចំណេះដឹង បច្ចេកវិទ្យា និងមនសិការស្នេហាជាតិដ៏មុតមាំ។',
      icon: '💪',
      accent: '#34d399',
      bg: 'from-emerald-900/90 via-slate-900/90 to-emerald-950/90'
    }
  ];

  const timelineEvents = [
    { year: '២០២៦', title: 'ស្មារតីការពារព្រំដែនជាតិ', desc: 'សាមគ្គីភាពរឹងមាំទូទាំងប្រទេស', icon: '🔥' },
    { year: '២០២៦', title: 'ប្រជាជនខ្មែររួបរួមជាធ្លុងមួយ', desc: 'កម្លាំងមហាសាមគ្គីជាតិខ្មែរ', icon: '🤝' },
    { year: '២០២៦', title: 'ថែរក្សាវប្បធម៌ និងប្រវត្តិសាស្ត្រ', desc: 'ការពារកេរដំណែលដូនតាខ្មែរ', icon: '👑' },
    { year: '២០២៦', title: 'យុវជនក្រោកឈរដើម្បីជាតិ', desc: 'មោទនភាពជាតិខ្មែរអមតៈ', icon: '💪' }
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl font-kantumruy border-2 border-amber-400/40 shadow-2xl" id="khmer-pride-section">

      {/* ═══════ HIGH-VISIBILITY TENOR CAMBODIA FLAG GIF ═══════ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Crisp, Vibrant Flag GIF */}
        <img
          src={LOCAL_FLAG_GIF}
          onError={(e) => { e.currentTarget.src = FALLBACK_FLAG_GIF; }}
          alt="Cambodian Flag Waving Animation"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter brightness-95 contrast-110"
        />

        {/* Semi-transparent dark gradient overlay so text remains 100% legible while flag is totally visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#030712]/50 to-[#020617]/80 backdrop-blur-[1px]" />
      </div>

      {/* ═══════ FOREGROUND CONTENT ═══════ */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-8">

        {/* ── HEADER ── */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          
          {/* Top National Emblem Ribbon */}
          <div className="inline-flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-xl px-5 py-2 rounded-full border border-amber-400/50 shadow-xl">
            <span className="text-2xl">🇰🇭</span>
            <span className="text-amber-300 font-black text-xs sm:text-sm tracking-wider font-kantumruy drop-shadow">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </span>
            <span className="text-2xl">🇰🇭</span>
          </div>

          {/* Main Title with glowing shadow */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-moul leading-[1.6] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              មោទនភាពជាតិខ្មែរ ២០២៦
            </h2>
            <p className="text-amber-300 font-extrabold text-sm sm:text-base tracking-widest uppercase drop-shadow">
              KHMER PRIDE & NATIONAL SOVEREIGNTY 2026
            </p>
          </div>

          <p className="text-white text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-slate-950/50 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            ស្មារតីសាមគ្គីភាពការពារទឹកដី អធិបតេយ្យភាពជាតិ និងលើកតម្កើងមោទនភាពវប្បធម៌ខ្មែរដ៏រុងរឿង។
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
            <span className="px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>ការពារទឹកដី ២០២៦</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/60 text-blue-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>ប្រាសាទព្រះវិហារខ្មែរ</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>កម្ពុជាក្រោមដួងចិត្តខ្មែរ</span>
            </span>
          </div>
        </div>

        {/* ── INTERACTIVE STORY HERO CARD ── */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Active Story Card */}
            <div
              className={`lg:col-span-3 relative rounded-2xl overflow-hidden p-6 sm:p-8 min-h-[250px] flex flex-col justify-between transition-all duration-700 bg-gradient-to-br ${stories[activeStory].bg} border-2 border-white/30 shadow-2xl backdrop-blur-md`}
              style={{ boxShadow: `0 15px 40px ${stories[activeStory].accent}40` }}
            >
              <div className="relative z-10 space-y-2.5">
                <span className="text-4xl block drop-shadow-md">
                  {stories[activeStory].icon}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-kantumruy leading-snug drop-shadow-md">
                  {stories[activeStory].title}
                </h3>
                <p className="text-xs font-bold" style={{ color: stories[activeStory].accent }}>
                  {stories[activeStory].titleEn}
                </p>
                <p className="text-white/95 text-xs sm:text-sm leading-relaxed drop-shadow">
                  {stories[activeStory].desc}
                </p>
              </div>

              {/* Progress dots indicator */}
              <div className="relative z-10 flex items-center gap-2 pt-4">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveStory(i)}
                    className="h-2 rounded-full transition-all duration-500 cursor-pointer shadow"
                    style={{
                      width: i === activeStory ? '36px' : '10px',
                      background: i === activeStory ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Side Story Selection Tabs */}
            <div className="lg:col-span-2 space-y-2.5 flex flex-col justify-center">
              {stories.map((story, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStory(i)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                    i === activeStory
                      ? 'bg-slate-950/90 backdrop-blur-xl border-2 border-amber-400 shadow-xl scale-[1.02]'
                      : 'bg-slate-950/60 backdrop-blur-md border border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{story.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xs sm:text-sm truncate font-kantumruy ${i === activeStory ? 'text-amber-300' : 'text-white'}`}>
                      {story.title}
                    </p>
                    <p className="text-slate-300 text-[10px] truncate">{story.titleEn}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${i === activeStory ? 'text-amber-400' : 'text-white/40'}`} />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── 4 TIMELINE COLUMNS ── */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            <h3 className="text-white font-extrabold text-base sm:text-lg font-kantumruy drop-shadow">
              ព្រឹត្តិការណ៍ និងស្មារតីជាតិ ២០២៦
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timelineEvents.map((item, i) => (
              <div
                key={i}
                className="bg-slate-950/75 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2 hover:bg-slate-900/90 hover:border-amber-400 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                    {item.year}
                  </span>
                </div>
                <h4 className="text-white font-bold text-xs sm:text-sm leading-snug font-kantumruy">
                  {item.title}
                </h4>
                <p className="text-slate-300 text-[11px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PATRIOTIC SLOGAN BANNER ── */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 text-center bg-slate-950/85 border-2 border-amber-400/60 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="inline-flex items-center gap-4 text-3xl sm:text-5xl select-none">
              <span className="animate-bounce" style={{ animationDuration: '2.5s' }}>🇰🇭</span>
              <span className="text-amber-400 font-black">⚔️</span>
              <span className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}>🇰🇭</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-amber-300 font-moul leading-relaxed drop-shadow-md">
              ទឹកដីខ្មែរ មិនអាចឱ្យនរណារំលោភបំពានបានឡើយ!
            </h3>
            
            <p className="text-white font-bold text-xs sm:text-sm tracking-wide">
              "Khmer Land & Heritage Shall Stand United Forever!"
            </p>

            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <span className="px-4 py-2 rounded-xl bg-blue-900/60 border border-blue-400 text-blue-200 text-xs font-bold flex items-center gap-2 shadow-md">
                <Shield className="w-4 h-4 text-blue-300" />
                <span>ការពារទឹកដីមាតុភូមិ</span>
              </span>
              <span className="px-4 py-2 rounded-xl bg-red-900/60 border border-red-400 text-red-200 text-xs font-bold flex items-center gap-2 shadow-md">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span>ស្មារតីស្នេហាជាតិ</span>
              </span>
              <span className="px-4 py-2 rounded-xl bg-amber-900/60 border border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-2 shadow-md">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>មោទនភាពជាតិខ្មែរ</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
