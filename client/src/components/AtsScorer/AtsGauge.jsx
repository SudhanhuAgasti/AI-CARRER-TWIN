import React from 'react';
import { FileCheck2 } from 'lucide-react';

/**
 * AtsGauge Component
 * Renders the circular SVG score indicator and grade badge.
 */
export default function AtsGauge({ score, maxScore, grade }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  const gradeClasses = {
    A: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    B: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    C: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    D: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 text-center sm:text-left">
      
      {/* SVG Radial Progress Gauge */}
      <div className="relative w-[140px] h-[140px] shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle 
            className="fill-none stroke-white/3" 
            cx="70" cy="70" r={radius} 
            strokeWidth="10"
          />
          <circle 
            className="fill-none stroke-[url(#cyan-purple-gradient)] stroke-linecap-round transition-all duration-1000 ease-out" 
            cx="70" cy="70" r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center font-sans">
          <span className="text-[2.2rem] font-bold text-slate-50 leading-none">{score}</span>
          <span className="text-[10px] text-slate-400 mt-1">/ {maxScore}</span>
        </div>
      </div>

      {/* Grade Display Panel */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FileCheck2 className="w-5 h-5 text-violet-400" />
          <h3 className="font-sans text-lg font-bold text-slate-50">ATS Diagnostics</h3>
        </div>
        <p className="text-sm text-slate-400 max-w-[320px] leading-relaxed">
          Your resume was evaluated against standard industrial parser rules.
        </p>
        <div className="flex gap-3 justify-center sm:justify-start mt-2">
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold font-sans uppercase ${gradeClasses[grade] || gradeClasses.D}`}>
            Grade {grade}
          </div>
          <div className="bg-white/3 border border-white/8 text-slate-400 px-4 py-1.5 rounded-full text-xs font-medium">
            {score >= 80 ? 'Job Ready' : score >= 60 ? 'Strong Foundation' : 'Needs Optimization'}
          </div>
        </div>
      </div>
    </div>
  );
}
