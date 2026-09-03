import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Trophy, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Award,
  Crown,
  Check,
  X,
  Volume2,
  VolumeX,
  BookOpen,
  GraduationCap,
  Atom,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Brain,
  Beaker,
  Globe,
  Calculator,
  Languages,
  Scale,
  Leaf,
  History
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, fetchLiveExamQuestions, resetGameSessionQuestions } from '../../utils/gamePoolManager';
import VictoryRewardCelebration from './VictoryRewardCelebration';
import AcademicTextRenderer from '../common/AcademicTextRenderer';

// ═══════════════════════════════════════════════════════════════
// SUBJECT CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

const SCIENCE_SUBJECTS = [
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', labelEn: 'Mathematics', icon: Calculator, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', labelEn: 'Khmer Language', icon: BookOpen, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-400/30' },
  { key: 'រូបវិទ្យា', label: 'រូបវិទ្យា', labelEn: 'Physics', icon: Atom, color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/10', border: 'border-cyan-400/30' },
  { key: 'គីមីវិទ្យា', label: 'គីមីវិទ្យា', labelEn: 'Chemistry', icon: Beaker, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10', border: 'border-emerald-400/30' },
  { key: 'ជីវវិទ្យា', label: 'ជីវវិទ្យា', labelEn: 'Biology', icon: Brain, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-500/10', border: 'border-pink-400/30' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', labelEn: 'History', icon: History, color: 'from-yellow-600 to-amber-700', bg: 'bg-yellow-500/10', border: 'border-yellow-400/30' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', labelEn: 'English', icon: Languages, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-400/30' },
];

const SOCIAL_SUBJECTS = [
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', labelEn: 'Khmer Language', icon: BookOpen, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-400/30' },
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', labelEn: 'Mathematics', icon: Calculator, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', labelEn: 'History', icon: History, color: 'from-yellow-600 to-amber-700', bg: 'bg-yellow-500/10', border: 'border-yellow-400/30' },
  { key: 'ភូមិវិទ្យា', label: 'ភូមិវិទ្យា', labelEn: 'Geography', icon: Globe, color: 'from-teal-500 to-emerald-600', bg: 'bg-teal-500/10', border: 'border-teal-400/30' },
  { key: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', label: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', labelEn: 'Civics & Morality', icon: Scale, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-500/10', border: 'border-slate-400/30' },
  { key: 'ផែនដី និងបរិស្ថាន', label: 'ផែនដី និងបរិស្ថាន', labelEn: 'Earth & Environment', icon: Leaf, color: 'from-green-500 to-lime-600', bg: 'bg-green-500/10', border: 'border-green-400/30' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', labelEn: 'English', icon: Languages, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-400/30' },
];

const GENERAL_SUBJECTS = [
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', labelEn: 'Mathematics', icon: Calculator, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', labelEn: 'Khmer Language', icon: BookOpen, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-400/30' },
  { key: 'វិទ្យាសាស្ត្រ', label: 'វិទ្យាសាស្ត្រ', labelEn: 'Science', icon: Atom, color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/10', border: 'border-cyan-400/30' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', labelEn: 'History', icon: History, color: 'from-yellow-600 to-amber-700', bg: 'bg-yellow-500/10', border: 'border-yellow-400/30' },
  { key: 'ភូមិវិទ្យា', label: 'ភូមិវិទ្យា', labelEn: 'Geography', icon: Globe, color: 'from-teal-500 to-emerald-600', bg: 'bg-teal-500/10', border: 'border-teal-400/30' },
  { key: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', label: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', labelEn: 'Civics & Morality', icon: Scale, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-500/10', border: 'border-slate-400/30' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', labelEn: 'English', icon: Languages, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-400/30' },
];

const GRADE_COLORS = [
  'from-blue-400 to-blue-600',
  'from-cyan-400 to-cyan-600',
  'from-teal-400 to-teal-600',
  'from-emerald-400 to-emerald-600',
  'from-green-400 to-green-600',
  'from-lime-500 to-green-600',
  'from-yellow-400 to-amber-600',
  'from-amber-400 to-orange-600',
  'from-orange-400 to-red-600',
  'from-rose-400 to-pink-600',
  'from-purple-400 to-violet-600',
  'from-indigo-400 to-blue-600',
];

const KHMER_NUMERALS = ['១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩', '១០', '១១', '១២'];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function PlaygroundGameModal({ game, onClose }) {
  const { addXP, student } = useAuth();
  const levelInfo = computeLevelData(student.xp);

  // Selection state
  const [step, setStep] = useState('grade'); // 'grade' | 'stream' | 'subject' | 'loading' | 'playing'
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Game state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90);

  const autoNextTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      clearTimeout(autoNextTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // ═════════════════════════════════════════════
  // STEP HANDLERS
  // ═════════════════════════════════════════════

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    if (soundEnabled) playSound.click();
    
    if (grade >= 11) {
      // Grades 11-12: go to stream selection
      setStep('stream');
    } else {
      // Grades 1-10: skip stream, go to subject
      setSelectedStream(null);
      setStep('subject');
    }
  };

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    if (soundEnabled) playSound.click();
    setStep('subject');
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    if (soundEnabled) playSound.correct();
    setStep('loading');
    setAiError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_URL}/ai/quiz-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: String(selectedGrade),
          subject: subject.key,
          stream: selectedStream,
          count: 7
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setSecondsLeft(Math.max(60, data.questions.length * 15));
          setStep('playing');
          return;
        }
      }
    } catch (err) {
      console.warn('[AI Quiz Fetch]:', err.message);
    }

    // Fallback to local question pool
    try {
      const fallbackStream = selectedStream || (selectedGrade >= 11 ? 'science' : 'all');
      const localQuestions = getRandomizedGameQuestions(
        { ...game, subjectKey: subject.key, subject: subject.label, stream: fallbackStream },
        8,
        String(selectedGrade),
        fallbackStream
      );
      if (localQuestions && localQuestions.length > 0) {
        setQuestions(localQuestions);
        setSecondsLeft(Math.max(60, localQuestions.length * 12));
        setStep('playing');
        return;
      }
    } catch (e) {}

    // If both fail, retry with AI
    setAiError('សំណួរមិនអាចបង្កើតបានទេ។ សូមសាកល្បងម្តងទៀត។');
    setStep('subject');
  };

  const handleBack = () => {
    if (step === 'stream') {
      setSelectedStream(null);
      setStep('grade');
    } else if (step === 'subject') {
      if (selectedGrade >= 11) {
        setSelectedSubject(null);
        setStep('stream');
      } else {
        setSelectedSubject(null);
        setStep('grade');
      }
    }
  };

  // ═════════════════════════════════════════════
  // GAME LOGIC
  // ═════════════════════════════════════════════

  // Timer countdown
  useEffect(() => {
    if (step !== 'playing' || isGameOver) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, isGameOver]);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    setNextCountdown(3);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      if (soundEnabled) {
        playSound.correct();
        if (combo >= 1) setTimeout(() => playSound.combo(combo + 1), 200);
      }
      const newCombo = combo + 1;
      setCombo(newCombo);
      const pointsEarned = 100 * (newCombo >= 3 ? 2 : newCombo >= 2 ? 1.5 : 1);
      setScore((prev) => prev + pointsEarned);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      if (soundEnabled) playSound.wrong();
      setCombo(0);
    }

    // Auto-transition countdown
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setNextCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 3000);
  };

  const handleNextQuestion = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setNextCountdown(3);
    } else {
      handleEndGame();
    }
  };

  const handleEndGame = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setIsGameOver(true);
    if (soundEnabled) playSound.victory();
    const earnedXP = Math.round((game?.xpReward || 300) * (correctAnswersCount / (questions.length || 1)));
    if (earnedXP > 0) {
      addXP(earnedXP);
    }
  };

  const handleRestart = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    resetGameSessionQuestions();
    setStep('grade');
    setSelectedGrade(null);
    setSelectedStream(null);
    setSelectedSubject(null);
    setQuestions([]);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setNextCountdown(3);
    setScore(0);
    setCombo(0);
    setCorrectAnswersCount(0);
    setIsGameOver(false);
    setSecondsLeft(90);
    setAiError(null);
  };

  const earnedXP = Math.round((game?.xpReward || 300) * (correctAnswersCount / (questions.length || 1)));

  // ═════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy"
      onClick={onClose}
      style={{ overscrollBehavior: 'contain' }}
    >
      
      {/* Main Modal Container — fixed scroll issues */}
      <div 
        className="bg-[#0e1626] rounded-3xl w-full max-w-2xl border-2 border-slate-700 shadow-2xl flex flex-col max-h-[95vh] text-white relative"
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        
        {/* ═══ TOP HEADER ═══ */}
        <div className="bg-[#090d16] text-white px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            {(step !== 'grade' && step !== 'playing' && step !== 'loading') && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer mr-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="p-2 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-300 border border-amber-400/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-cinzel">
                ★ AI ACADEMIC QUIZ ★
              </span>
              <h3 className="font-extrabold text-xs sm:text-sm line-clamp-1 text-white">
                {step === 'grade' && 'ជ្រើសរើសថ្នាក់រៀន'}
                {step === 'stream' && 'ជ្រើសរើសផ្នែក'}
                {step === 'subject' && 'ជ្រើសរើសមុខវិជ្ជា'}
                {step === 'loading' && 'កំពុងបង្កើតសំណួរ...'}
                {step === 'playing' && (game?.titleKm || 'AI Quiz Challenge')}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'playing' && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-cinzel border ${
                secondsLeft <= 10 ? 'bg-rose-500/20 text-rose-300 border-rose-400 animate-pulse' : 'bg-slate-800 text-white border-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{secondsLeft}s</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/30 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ═══ SCROLLABLE CONTENT AREA ═══ */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          
          {/* ═══════════════════════════════════════
               STEP 1: GRADE SELECTION
             ═══════════════════════════════════════ */}
          {step === 'grade' && (
            <div className="p-5 sm:p-6 space-y-5 pb-24 sm:pb-8">
              
              {/* Title */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">ជ្រើសរើសថ្នាក់ទីរបស់អ្នក</span>
                </div>
                <p className="text-slate-400 text-xs">Choose your grade level — AI will generate matching questions</p>
              </div>

              {/* Grade Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeSelect(grade)}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                      selectedGrade === grade
                        ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-gradient-to-br ' + GRADE_COLORS[grade - 1]
                        : 'border-slate-700 hover:border-slate-500 bg-[#131d31]'
                    }`}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${GRADE_COLORS[grade - 1]} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    
                    <span className={`text-2xl sm:text-3xl font-black font-cinzel relative z-10 ${
                      selectedGrade === grade ? 'text-white' : 'text-slate-200'
                    }`}>
                      {KHMER_NUMERALS[grade - 1]}
                    </span>
                    <span className={`text-[10px] font-bold relative z-10 mt-0.5 ${
                      selectedGrade === grade ? 'text-white/80' : 'text-slate-400'
                    }`}>
                      Grade {grade}
                    </span>
                    
                    {/* Badge for 11-12 */}
                    {grade >= 11 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[7px] font-black text-slate-950 z-10">
                        BAC II
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
               STEP 2: STREAM SELECTION (Grade 11-12)
             ═══════════════════════════════════════ */}
          {step === 'stream' && (
            <div className="p-5 sm:p-6 space-y-5 pb-24 sm:pb-8">
              
              {/* Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-300">ថ្នាក់ទី {KHMER_NUMERALS[selectedGrade - 1]} — ជ្រើសរើសផ្នែក</span>
                </div>
                <p className="text-slate-400 text-xs">Select your academic track</p>
              </div>

              {/* Stream Cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Science Track */}
                <button
                  type="button"
                  onClick={() => handleStreamSelect('science')}
                  className="group relative flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-[#0d1929] to-[#0f2035] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-pointer text-left active:scale-[0.98]"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex-shrink-0">
                    <Atom className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-black text-white">វិទ្យាសាស្ត្រពិត</h4>
                    <p className="text-[11px] text-cyan-300/70 font-medium">Real Science Track</p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      គណិតវិទ្យា • រូបវិទ្យា • គីមីវិទ្យា • ជីវវិទ្យា • ប្រវត្តិវិទ្យា • ភាសាខ្មែរ • ភាសាអង់គ្លេស
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </button>

                {/* Social Science Track */}
                <button
                  type="button"
                  onClick={() => handleStreamSelect('social')}
                  className="group relative flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-[#1a1708] to-[#1e1b0f] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-300 cursor-pointer text-left active:scale-[0.98]"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg flex-shrink-0">
                    <Landmark className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-black text-white">វិទ្យាសាស្ត្រសង្គម</h4>
                    <p className="text-[11px] text-amber-300/70 font-medium">Social Science Track</p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      ភាសាខ្មែរ • គណិតវិទ្យា • ប្រវត្តិវិទ្យា • ភូមិវិទ្យា • សីលធម៌ • ផែនដី និងបរិស្ថាន • ភាសាអង់គ្លេស
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
               STEP 3: SUBJECT SELECTION
             ═══════════════════════════════════════ */}
          {step === 'subject' && (
            <div className="p-5 sm:p-6 space-y-5 pb-24 sm:pb-8">
              
              {/* Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">
                    ថ្នាក់ទី {KHMER_NUMERALS[selectedGrade - 1]}
                    {selectedStream === 'science' && ' • វិទ្យាសាស្ត្រពិត'}
                    {selectedStream === 'social' && ' • វិទ្យាសាស្ត្រសង្គម'}
                    {' — ជ្រើសរើសមុខវិជ្ជា'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">Choose a subject — AI will create questions just for you</p>
              </div>

              {/* Error message */}
              {aiError && (
                <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl px-4 py-2.5 text-xs text-rose-300 text-center">
                  ⚠️ {aiError}
                </div>
              )}

              {/* Subject Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(selectedStream === 'science' ? SCIENCE_SUBJECTS : selectedStream === 'social' ? SOCIAL_SUBJECTS : GENERAL_SUBJECTS).map((subject) => {
                  const IconComp = subject.icon;
                  return (
                    <button
                      key={subject.key}
                      type="button"
                      onClick={() => handleSubjectSelect(subject)}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border-2 ${subject.border} ${subject.bg} hover:shadow-lg transition-all duration-300 cursor-pointer text-left active:scale-[0.97]`}
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${subject.color} shadow-md flex-shrink-0`}>
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-white">{subject.label}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{subject.labelEn}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
               LOADING STATE
             ═══════════════════════════════════════ */}
          {step === 'loading' && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 min-h-[400px]">
              {/* Animated loader */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-white">AI កំពុងបង្កើតសំណួរ...</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Gemini AI is generating {selectedSubject?.label} questions for Grade {selectedGrade}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-amber-400"
                    style={{
                      animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.3
                    }}
                  />
                ))}
              </div>

              <style>{`
                @keyframes pulse {
                  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                  40% { opacity: 1; transform: scale(1.2); }
                }
              `}</style>
            </div>
          )}

          {/* ═══════════════════════════════════════
               STEP 4: QUIZ GAME
             ═══════════════════════════════════════ */}
          {step === 'playing' && !isGameOver && currentQ && (
            <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4 pb-24 sm:pb-6">
              
              {/* Stats Bar */}
              <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">សំណួរទី</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-cinzel font-black">
                    {currentQIndex + 1} / {questions.length}
                  </span>
                  {selectedSubject && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {selectedSubject.label}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {combo >= 2 && (
                    <span className="text-amber-400 flex items-center gap-1 font-cinzel text-xs font-black animate-pulse">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> x{combo} COMBO!
                    </span>
                  )}
                  <div className="bg-slate-800 text-amber-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-cinzel font-black">{score} PTS</span>
                  </div>
                </div>
              </div>

              {/* AI Badge */}
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Generated
                </span>
                <span className="text-slate-500">ថ្នាក់ទី {KHMER_NUMERALS[selectedGrade - 1]} • {selectedStream === 'science' ? 'វិទ្យាសាស្ត្រពិត' : selectedStream === 'social' ? 'វិទ្យាសាស្ត្រសង្គម' : 'ទូទៅ'}</span>
              </div>

              {/* Question Text */}
              <div className="bg-[#131d31] rounded-2xl p-5 border border-slate-700 shadow-inner">
                <div className="font-extrabold text-sm sm:text-base text-white leading-relaxed">
                  <AcademicTextRenderer content={currentQ.q} baseTextSize="text-sm sm:text-base" />
                </div>
              </div>

              {/* 4 Option Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = isAnswerSubmitted && idx === currentQ.answer;
                  const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.answer;

                  let style = 'bg-[#131d31] hover:bg-[#1a2742] border-b-[5px] border-slate-900 text-slate-200';
                  if (isCorrect) {
                    style = 'bg-emerald-600 border-b-[5px] border-emerald-800 text-white ring-2 ring-emerald-300 shadow-xl';
                  } else if (isWrong) {
                    style = 'bg-rose-700 border-b-[5px] border-rose-900 text-white opacity-70';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer active:translate-y-1 active:border-b-0 ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center text-xs font-black font-cinzel text-amber-300 flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
                      {isWrong && <XCircle className="w-5 h-5 text-rose-200 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Auto-Next Timer */}
              {isAnswerSubmitted && (
                <div className="bg-[#131d31] rounded-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs text-slate-300 space-y-1 flex-1">
                    <strong className="font-bold text-amber-300 block">💡 គន្លឹះដោះស្រាយ៖</strong>
                    {currentQ.explanation ? (
                      <AcademicTextRenderer content={currentQ.explanation} baseTextSize="text-xs" />
                    ) : (
                      <span className="text-slate-500">ចម្លើយត្រឹមត្រូវគឺ៖ {currentQ.options[currentQ.answer]}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-bold text-amber-400 font-cinzel animate-pulse">
                      Next in {nextCountdown}s...
                    </span>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
                    >
                      <span>សំណួរបន្ទាប់ ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════
               GAME OVER / VICTORY
             ═══════════════════════════════════════ */}
          {step === 'playing' && isGameOver && (
            <VictoryRewardCelebration
              title="អ្នកបានបញ្ចប់ AI Quiz Challenge!"
              subtitle={`ថ្នាក់ទី ${KHMER_NUMERALS[selectedGrade - 1]} • ${selectedSubject?.label || ''}`}
              score={score}
              xpEarned={earnedXP}
              correctCount={correctAnswersCount}
              totalCount={questions.length}
              onRestart={handleRestart}
              onClose={onClose}
            />
          )}

        </div>

      </div>

    </div>,
    document.body
  );
}
