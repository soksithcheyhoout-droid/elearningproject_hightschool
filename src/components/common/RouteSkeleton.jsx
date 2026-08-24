import React from 'react';

export default function RouteSkeleton({ title = 'កំពុងដំណើរការទិន្នន័យ...', subtitle = 'សូមរង់ចាំមួយភ្លែត...' }) {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center font-kantumruy animate-fadeIn">
      {/* Central Shimmer Card */}
      <div className="w-full max-w-xl p-8 rounded-3xl bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Animated Light Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite] pointer-events-none" />

        {/* Pulse Logo / Spinner */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-75" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[2px] shadow-lg shadow-amber-500/20 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-2xl animate-bounce">🇰🇭</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <p className="text-xs text-amber-200/80">{subtitle}</p>
        </div>

        {/* Skeleton Bars */}
        <div className="space-y-3 pt-2">
          <div className="h-3 bg-slate-800/80 rounded-full w-4/5 mx-auto animate-pulse" />
          <div className="h-2.5 bg-slate-800/50 rounded-full w-3/5 mx-auto animate-pulse delay-75" />
          <div className="h-2 bg-slate-800/30 rounded-full w-2/5 mx-auto animate-pulse delay-150" />
        </div>

        {/* Royal Star Divider */}
        <div className="flex items-center justify-center gap-3 pt-2 opacity-60">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="text-[10px] text-amber-300">✦</span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </div>
    </div>
  );
}
