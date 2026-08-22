import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  X,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function QuizModal({ quiz, onClose }) {
  const { t, lang } = useLanguage();
  const { recordQuizResult } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds || 300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Prevent background scrolling when Quiz modal is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', labelKm: 'និទ្ទេស A (ល្អប្រសើរ)', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
    if (percentage >= 80) return { grade: 'B', labelKm: 'និទ្ទេស B (ល្អណាស់)', color: 'text-sky-800', bg: 'bg-sky-50 border-sky-200' };
    if (percentage >= 70) return { grade: 'C', labelKm: 'និទ្ទេស C (ល្អ)', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' };
    if (percentage >= 60) return { grade: 'D', labelKm: 'និទ្ទេស D (ល្អបង្គួរ)', color: 'text-purple-800', bg: 'bg-purple-50 border-purple-200' };
    if (percentage >= 50) return { grade: 'E', labelKm: 'និទ្ទេស E (មធ្យម)', color: 'text-orange-800', bg: 'bg-orange-50 border-orange-200' };
    return { grade: 'F', labelKm: 'និទ្ទេស F (ធ្លាក់)', color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200' };
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    recordQuizResult(quiz.id, calculatedScore, 100);

    if (calculatedScore >= 50) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const currentQ = quiz.questions[currentIdx];
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const gradeInfo = calculateGrade(score);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-kantumruy animate-fadeIn">
      <div className="khmer-card w-full max-w-2xl bg-white border-slate-200 p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="badge-gold text-xs">
              {quiz.subject}
            </span>
            <h2 className="font-moul text-sm sm:text-base text-slate-900 mt-1">
              {lang === 'km' ? quiz.titleKm : quiz.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold text-amber-800 font-cinzel">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exam View vs Results View */}
        {!isSubmitted ? (
          <div className="space-y-6">
            
            {/* Question Tracker Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center font-cinzel ${
                    currentIdx === idx
                      ? 'bg-amber-500 text-white font-extrabold shadow-sm'
                      : selectedAnswers[idx] !== undefined
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Current Question */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t('question')} {currentIdx + 1} {t('of')} {quiz.questions.length}</span>
                <span className="font-cinzel">100 ពិន្ទុ</span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {lang === 'km' ? currentQ.questionKm : currentQ.questionEn}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between shadow-sm ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="btn-secondary text-xs py-2 px-4 disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('prevQuestion')}</span>
              </button>

              {currentIdx < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="btn-gold text-xs py-2 px-5 font-bold"
                >
                  <span>{t('nextQuestion')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-gold text-xs py-2.5 px-6 font-bold shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('submitQuiz')}</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 mx-auto flex items-center justify-center shadow-md">
              <Trophy className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900 font-kantumruy leading-[1.6]">
                {t('quizCompleted')}
              </h3>
              <p className="text-xs text-slate-600 font-kantumruy">
                {gradeInfo.labelKm}
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 max-w-sm mx-auto space-y-2">
              <div className="text-4xl font-extrabold text-amber-900 font-cinzel">
                {score} / 100
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold border border-amber-300 text-amber-900 bg-white shadow-sm">
                និទ្ទេស៖ {gradeInfo.grade}
              </div>
            </div>

            {/* Solution Reviews */}
            <div className="space-y-3 text-left max-h-72 overflow-y-auto pr-1">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                {t('reviewAnswers')}:
              </h4>
              {quiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrectAns = userAns === q.correctIndex;
                return (
                  <div key={idx} className={`p-4 rounded-xl border text-xs space-y-1.5 shadow-sm ${
                    isCorrectAns ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        {idx + 1}. {lang === 'km' ? q.questionKm : q.questionEn}
                      </p>
                      {isCorrectAns ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600">
                      ចម្លើយរបស់អ្នក៖ <span className="font-bold text-slate-900">{userAns !== undefined ? q.options[userAns] : 'មិនបានឆ្លើយ'}</span> | ចម្លើយត្រឹមត្រូវ៖ <span className="font-bold text-emerald-700">{q.options[q.correctIndex]}</span>
                    </p>

                    <p className="text-[11px] text-slate-700 pt-1 border-t border-slate-200">
                      {lang === 'km' ? q.explanationKm : q.explanationEn}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setTimeLeft(quiz.timeLimitSeconds || 300);
                  setCurrentIdx(0);
                }}
                className="btn-secondary text-xs py-2 px-4"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('retakeQuiz')}</span>
              </button>
              <button
                onClick={onClose}
                className="btn-gold text-xs py-2 px-6 font-bold"
              >
                <span>យល់ព្រម (Done)</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
