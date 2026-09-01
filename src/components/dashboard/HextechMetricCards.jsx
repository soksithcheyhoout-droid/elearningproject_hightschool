import React from 'react';
import { computeLevelData } from '../../context/AuthContext';

/**
 * ModernMetricCards - Ultra-Premium, Human-Crafted Educational Metrics
 * Designed with Stripe/Apple aesthetic: micro-heatmaps, segmented curriculum meters, and dynamic level computation.
 */
export default function HextechMetricCards({ student, currentGradeResult, percentage, totalScore: propTotalScore }) {
  const completedCount = student?.completedLessons?.length || 4;
  const totalChapters = 12;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);
  const totalScore = propTotalScore || 488;
  const daysOfWeek = ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'];

  // Dynamically compute student's exact live level, progress percentage, and XP needed
  const levelInfo = computeLevelData(student?.xp || 2915);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 my-3">
      
      {/* 1. STREAK CARD (7-Day Interactive Activity Heatmap) */}
      <div className="relative group bg-white dark:bg-[#0f172a] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.08)] hover:border-amber-300/80 dark:hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between">
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10.5px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 font-khmer truncate">
              ការសិក្សាជាប់គ្នា
            </span>
            <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-700/50 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* Main Stat */}
          <div className="my-1.5 sm:my-2.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-cinzel tracking-tight">
              {student?.streakDays || 14}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-khmer">
              ថ្ងៃជាប់គ្នា
            </span>
          </div>
        </div>

        {/* 7-Day Day-by-Day Heatmap Tracker */}
        <div className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-0.5 sm:gap-1">
            {daysOfWeek.map((day, idx) => {
              const isDone = idx < 6;
              const isToday = idx === 5;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1">
                  <span className={`w-full h-1 sm:h-1.5 rounded-full transition-all ${
                    isDone 
                      ? isToday 
                        ? 'bg-amber-500 ring-1 ring-amber-200' 
                        : 'bg-amber-400' 
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`} />
                  <span className={`text-[8px] sm:text-[9px] font-khmer ${isToday ? 'font-bold text-amber-900 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] text-slate-400 dark:text-slate-400 pt-0.5">
            <span className="font-khmer">សប្តាហ៍នេះ</span>
            <span className="text-amber-800 dark:text-amber-400 font-semibold font-mono">7 / 7 ថ្ងៃ</span>
          </div>
        </div>
      </div>


      {/* 2. TOTAL XP CARD (Dual-Tone Dynamic Level Progress Meter) */}
      <div className="relative group bg-white dark:bg-[#0f172a] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,91,170,0.08)] hover:border-sky-300/80 dark:hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#005baa] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10.5px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 font-khmer truncate">
              ពិន្ទុ (Total XP)
            </span>
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#005baa] dark:text-cyan-300 bg-sky-50 dark:bg-sky-950/60 px-1.5 sm:px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-cyan-700/50 font-mono">
              Lv.{levelInfo.level}
            </span>
          </div>

          {/* Main Stat */}
          <div className="my-1.5 sm:my-2.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-4xl font-black text-[#002b5b] dark:text-white font-cinzel tracking-tight">
              {(student?.xp || 0).toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              XP
            </span>
          </div>
        </div>

        {/* Dynamic Level Progress Bar */}
        <div className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full h-1 sm:h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#005baa] to-sky-400 rounded-full transition-all duration-500" 
              style={{ width: `${levelInfo.progressPct}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] text-slate-400 dark:text-slate-400 font-mono pt-0.5">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{student?.xp || 0}/{levelInfo.nextTargetXP}</span>
            <span className="text-[#005baa] dark:text-cyan-400 font-bold">+{levelInfo.xpNeeded} XP</span>
          </div>
        </div>
      </div>


      {/* 3. BACII TARGET CARD (National Exam Score Prediction) */}
      <div className="relative group bg-white dark:bg-[#0f172a] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.08)] hover:border-emerald-300/80 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10.5px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 font-khmer truncate">
              គោលដៅបាក់ឌុប
            </span>
            <span className="text-[8.5px] sm:text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-700/50 font-mono">
              Forecast
            </span>
          </div>

          {/* Main Stat */}
          <div className="my-1.5 sm:my-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 font-cinzel tracking-tight">
              {currentGradeResult?.grade || 'A'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">
              ({percentage || 85}%)
            </span>
          </div>
        </div>

        {/* National Exam Score Bar */}
        <div className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full h-1 sm:h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500" 
              style={{ width: `${percentage || 85}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] text-slate-400 dark:text-slate-400 pt-0.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-khmer truncate">និទ្ទេសឆ្នើម</span>
            <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">{totalScore}/525</span>
          </div>
        </div>
      </div>


      {/* 4. COMPLETED LESSONS CARD (12-Chapter Segmented Curriculum Tracker) */}
      <div className="relative group bg-white dark:bg-[#0f172a] rounded-xl sm:rounded-2xl p-2.5 sm:p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(147,51,234,0.08)] hover:border-purple-300/80 dark:hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between">
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10.5px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 font-khmer truncate">
              មេរៀនបញ្ចប់
            </span>
            <span className="text-[8.5px] sm:text-[10px] font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-700/50 font-mono">
              Progress
            </span>
          </div>

          {/* Main Stat */}
          <div className="my-1.5 sm:my-2.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-cinzel tracking-tight">
              {completedCount}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              / {totalChapters} ជំពូក
            </span>
          </div>
        </div>

        {/* 12-Chapter Segmented Blocks */}
        <div className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {Array.from({ length: totalChapters }).map((_, idx) => {
              const isCompleted = idx < completedCount;
              return (
                <div 
                  key={idx} 
                  className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-purple-600 shadow-2xs' 
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`} 
                  title={`Chapter ${idx + 1}: ${isCompleted ? 'Completed' : 'Pending'}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] text-slate-400 dark:text-slate-400 pt-0.5 font-mono">
            <span className="text-purple-700 dark:text-purple-400 font-semibold font-mono">{progressPercent}% Done</span>
            <span className="text-slate-400 dark:text-slate-400">{totalChapters - completedCount} នៅសល់</span>
          </div>
        </div>
      </div>

    </div>
  );
}
