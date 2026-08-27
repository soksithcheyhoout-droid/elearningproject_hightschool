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
    subject: 'Mathematics (Math)',
    questionKm: 'If f(x) = e^(2x), what is f\'\'(x)?',
    questionEn: 'If f(x) = e^(2x), what is the second derivative f\'\'(x)?',
    options: ['2e^(2x)', '4e^(2x)', 'e^(2x)', '4x * e^(2x)'],
    correctIndex: 1,
    explanationKm: "f'(x) = 2e^(2x) => f''(x) = 2(2e^(2x)) = 4e^(2x)"
  };

  const handleDailySubmit = (idx) => {
    if (dailyAnswered) return;
    setSelectedOption(idx);
    setDailyAnswered(true);
    if (idx === dailyQuestion.correctIndex) {
      setIsCorrect(true);
      if (addXP) addXP(50);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 font-kantumruy">
      
      {/* Live Masterclass Card (2 cols) */}
      <div className="lg:col-span-2 p-3.5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-md">
        <div className="space-y-2.5 sm:space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase tracking-wide">
                Live Masterclass
              </span>
            </div>
            <span className="badge-moeys-gold text-[9px] sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>Free Access</span>
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-black text-[#002b5b] font-kantumruy leading-snug sm:leading-[1.6]">
              Practice Session: Physics Problem Solving
            </h3>
            <p className="text-[11px] sm:text-sm text-slate-700 mt-1.5 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
              Official national curriculum content published under MoTDAR standards and quality assurance framework.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 pt-1 text-xs text-slate-700 font-bold">
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] sm:text-xs">Mon - Fri</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] sm:text-xs">5:00 - 7:00 PM</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <span className="text-[10px] sm:text-xs">1,420 Students</span>
            </div>
          </div>

        </div>

        <div className="pt-3 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-100 flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-200 p-1 flex items-center justify-center shadow-2xs shrink-0">
            <img src="/assets/moeys-crest-transparent.png" alt="MoTDAR" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">National Curriculum Program</p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate">Ministry of Talent Development (MoTDAR)</p>
          </div>
        </div>

      </div>

      {/* Daily Challenge Quiz Card (1 col) */}
      <div className="p-3.5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-md">
        <div className="space-y-2 sm:space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="badge-moeys-gold text-[10px] sm:text-xs font-bold">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>Daily Quiz</span>
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
              let optClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/40';
              if (dailyAnswered) {
                if (idx === dailyQuestion.correctIndex) {
                  optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (selectedOption === idx) {
                  optClass = 'bg-rose-50 border-rose-400 text-rose-900';
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

          {/* Feedback */}
          {dailyAnswered && (
            <div className={`p-2.5 sm:p-3 rounded-lg text-[10px] sm:text-xs leading-relaxed mt-1.5 sm:mt-2 ${
              isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-rose-50 border border-rose-300 text-rose-900'
            }`}>
              <p className="font-bold mb-1">
                {isCorrect ? 'Correct! +50 XP' : 'Incorrect'}
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
            <span>Full Mock Exam</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}