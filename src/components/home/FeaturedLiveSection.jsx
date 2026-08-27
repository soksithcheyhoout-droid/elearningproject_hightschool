import React, { useState } from 'react';
import { 
  Radio, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function FeaturedLiveSection({ onStartQuiz, onSelectSubject }) {
  const { t, lang } = useLanguage();
  const { addXP } = useAuth();
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const dailyQuestion = {
    subject: "\u1782\u178e\u17b7\u178f\u179c\u17b7\u1791\u17d2\u1799\u17b6 (Math)",
    questionKm: "\u1794\u17be f(x) = e^(2x) \u178f\u17be\u178a\u17c1\u179a\u17b8\u179c\u17c1\u1791\u17b8\u17e2 f''(x) \u179f\u17d2\u1798\u17be\u1793\u17b9\u1784\u1794\u17c9\u17bb\u1793\u17d2\u1798\u17b6\u1793?",
    questionEn: "If f(x) = e^(2x), what is the second derivative f''(x)?",
    options: ["2e^(2x)", "4e^(2x)", "e^(2x)", "4x \u00b7 e^(2x)"],
    correctIndex: 1,
    explanationKm: "f'(x) = 2e^(2x) => f''(x) = 2(2e^(2x)) = 4e^(2x)\u17d4"
  };

  const handleDailySubmit = (idx) => {
    if (dailyAnswered) return;
    setSelectedOption(idx);
    setDailyAnswered(true);
    if (idx === dailyQuestion.correctIndex) {
      setIsCorrect(true);
      addXP(50);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 font-kantumruy">
      
      {/* Live Masterclass Card (2 cols) */}
      <div className="lg:col-span-2 p-3.5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-md">
        <div className="space-y-2.5 sm:space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase tracking-wide">
                Live Masterclass {'\u179c\u1782\u17d2\u1782\u1796\u17b7\u179f\u17c1\u179f'}
              </span>
            </div>
            <span className="badge-moeys-gold text-[9px] sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>{'\u178a\u17c4\u1799\u17a5\u178f\u1782\u17b7\u178f\u1790\u17d2\u179b\u17c3'} (Free Access)</span>
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-black text-[#002b5b] font-kantumruy leading-snug sm:leading-[1.6]">
              {'\u1782\u1793\u17d2\u179b\u17b9\u17c7\u178a\u17c4\u17c7\u179f\u17d2\u179a\u17b6\u1799\u179c\u17b7\u1789\u17d2\u1789\u17b6\u179f\u17b6\u1794\u17b6\u1780\u17cb\u178c\u17bb\u1794\u1782\u178e\u17b7\u178f\u179c\u17b7\u1791\u17d2\u1799\u17b6 \u1793\u17b7\u1784\u179a\u17bc\u1794\u179c\u17b7\u1791\u17d2\u1799\u17b6 \u1792\u17d2\u179b\u17b6\u1780\u17cb\u1789\u17b9\u1780\u1789\u17b6\u1794\u17cb\u1794\u17c6\u1795\u17bb\u178f'}
            </h3>
            <p className="text-[11px] sm:text-sm text-slate-700 mt-1 sm:mt-2 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
              {'\u1785\u17bc\u179b\u179a\u17bd\u1798\u179f\u17b7\u1780\u17d2\u179f\u17b6\u1795\u17d2\u1791\u17b6\u179b\u17cb\u1787\u17b6\u1798\u17bd\u1799\u1780\u17d2\u179a\u17bb\u1798\u1780\u17b6\u179a\u1784\u17b6\u179a\u1794\u1785\u17d2\u1785\u17c1\u1780\u1791\u17c1\u179f\u1780\u17d2\u179a\u179f\u17bd\u1784 \u178a\u17be\u1798\u17d2\u1794\u17b8\u179f\u17d2\u179c\u17c2\u1784\u1799\u179b\u17cb\u1796\u17b8\u179a\u1794\u17c0\u1794\u179f\u179a\u179f\u17c1\u179a\u178a\u17c4\u17c7\u179f\u17d2\u179a\u17b6\u1799\u179b\u17c6\u17a0\u17b6\u178f\u17cb\u179b\u17b8\u1798\u17b8\u178f \u1785\u17c6\u1793\u17bd\u1793\u1780\u17bb\u17c6\u1795\u17d2\u179b\u17b7\u1785 \u1793\u17b7\u1784\u1794\u17c9\u17c4\u179b\u1791\u17c4\u179b\u178a\u17be\u1798\u17d2\u1794\u17b8\u1794\u17b6\u1793\u1796\u17b7\u1793\u17d2\u1791\u17bb\u1796\u17c1\u1789\u17d4'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 pt-1 text-xs text-slate-700 font-bold">
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{'\u179a\u17c0\u1784\u179a\u17b6\u179b\u17cb\u1790\u17d2\u1784\u17c3\u179f\u17c5\u179a\u17cd-\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{'\u1798\u17c9\u17c4\u1784 \u17e7:\u17e0\u17e0 - \u17e8:\u17e3\u17e0 \u1799\u1794\u17cb'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{'\u17e1,\u17e2\u17e4\u17e0 \u1793\u17b6\u1780\u17cb\u1794\u17b6\u1793\u1785\u17bb\u17c7\u1788\u17d2\u1798\u17c4\u17c7'}</span>
            </div>
          </div>

        </div>

        <div className="pt-3 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-100 flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-200 p-1 flex items-center justify-center shadow-2xs shrink-0">
            <img src="/assets/moeys-crest-transparent.png" alt="MoTDAR" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">{'\u1780\u17d2\u179a\u17bb\u1798\u1780\u17b6\u179a\u1784\u17b6\u179a\u179f\u17d2\u179a\u17b6\u179c\u1787\u17d2\u179a\u17b6\u179c\u1782\u179a\u17bb\u1780\u17c4\u179f\u179b\u17d2\u1799'}</p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate">{'\u1780\u17d2\u179a\u179f\u17bd\u1784\u17a2\u1797\u17b7\u179c\u178c\u17d2\u178d\u1793\u17cd\u1791\u17c1\u1796\u1780\u17c4\u179f\u179b\u17d2\u1799'} (MoTDAR)</p>
          </div>
        </div>

      </div>

      {/* Daily Challenge Quiz Card (1 col) */}
      <div className="p-3.5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-md">
        <div className="space-y-2 sm:space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="badge-moeys-gold text-[10px] sm:text-xs font-bold">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>{'\u179f\u17c6\u178e\u17bd\u179a\u1794\u17d2\u179a\u1785\u17b6\u17c6\u1790\u17d2\u1784\u17c3'} (Daily Quiz)</span>
            </span>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold font-cinzel">
              +50 XP
            </span>
          </div>

          <p className="text-[10px] sm:text-xs font-bold text-sky-700">
            {dailyQuestion.subject}
          </p>

          <p className="text-[11px] sm:text-sm text-slate-900 font-semibold leading-relaxed">
            {lang === 'km' ? dailyQuestion.questionKm : dailyQuestion.questionEn}
          </p>

          {/* Options */}
          <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
            {dailyQuestion.options.map((opt, idx) => {
              let optClass = "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/40";
              if (dailyAnswered) {
                if (idx === dailyQuestion.correctIndex) {
                  optClass = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                } else if (selectedOption === idx) {
                  optClass = "bg-rose-50 border-rose-400 text-rose-900";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleDailySubmit(idx)}
                  disabled={dailyAnswered}
                  className={`w-full text-left p-2 sm:p-2.5 rounded-lg border text-[11px] sm:text-xs transition-all flex items-center justify-between shadow-sm ${optClass}`}
                >
                  <span>{opt}</span>
                  {dailyAnswered && idx === dailyQuestion.correctIndex && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {dailyAnswered && (
            <div className={`p-2.5 sm:p-3 rounded-lg text-[10px] sm:text-xs leading-relaxed mt-1.5 sm:mt-2 ${
              isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-rose-50 border border-rose-300 text-rose-900'
            }`}>
              <p className="font-bold mb-1">
                {isCorrect ? "\u178f\u17d2\u179a\u17b9\u1798\u178f\u17d2\u179a\u17bc\u179c\u178e\u17b6\u179f\u17cb! \u1791\u1791\u17bd\u179b\u1794\u17b6\u1793 +50 XP" : "\u1798\u17b7\u1793\u1791\u17b6\u1793\u17cb\u178f\u17d2\u179a\u17b9\u1798\u178f\u17d2\u179a\u17bc\u179c\u1791\u17c1"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-600">
                {dailyQuestion.explanationKm}
              </p>
            </div>
          )}

        </div>

        <div className="pt-3 sm:pt-4 mt-2.5 sm:mt-3 border-t border-slate-100 text-center">
          <button
            onClick={onStartQuiz}
            className="text-[10px] sm:text-xs text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1"
          >
            <span>{'\u179f\u17b6\u1780\u179b\u17d2\u1794\u1784\u17cb\u1792\u17d2\u179c\u17be\u179c\u17b7\u1789\u17d2\u1789\u17b6\u179f\u17b6\u1796\u17c1\u1789\u179b\u17c1\u1789'} (Full Mock Exam)</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}