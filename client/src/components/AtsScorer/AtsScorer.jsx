import React from 'react';
import { Check, X, FileCheck2, Info } from 'lucide-react';

/**
 * AtsScorer Component (Refactored with Tailwind CSS v4)
 * Displays a radial gauge score, overall grade, and a list of deterministic ATS checks.
 */
export default function AtsScorer({ atsData }) {
  const { score, maxScore, grade, checks } = atsData;

  // Circular gauge mathematics
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  // Grade color matching class names
  const gradeClasses = {
    A: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    B: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    C: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    D: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Gauge & Summary Header */}
      <div className="flex flex-col sm:flex-row items-center gap-10 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/50 text-center sm:text-left">
        
        {/* SVG Radial Progress Gauge */}
        <div className="relative w-[140px] height-[140px] shrink-0">
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

      {/* Checklist Grid */}
      <div className="flex flex-col gap-4 text-left">
        <h4 className="font-sans text-sm font-semibold text-slate-50 uppercase tracking-wider">
          Validation Checks ({checks.filter(c => c.passed).length}/{checks.length})
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-4 bg-slate-900/40 border rounded-2xl p-5 hover:bg-slate-900/60 hover:-translate-y-0.5 transition-all duration-200
                ${check.passed ? 'border-emerald-500/10' : 'border-red-500/10'}`}
            >
              <div className={`rounded-full w-8 h-8 flex items-center justify-center shrink-0 border
                ${check.passed 
                  ? 'bg-emerald-500/10 border-emerald-500/15' 
                  : 'bg-red-500/10 border-red-500/15'
                }`}
              >
                {check.passed ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </div>
              
              <div className="grow">
                <p className="font-sans font-medium text-sm text-slate-100 mb-0.5">{check.name}</p>
                {check.detail && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-400">{check.detail}</span>
                  </div>
                )}
              </div>

              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                ${check.passed 
                  ? 'text-emerald-400 border border-emerald-500/10 bg-emerald-500/10' 
                  : 'text-slate-400 border border-white/5 bg-white/2'
                }`}
              >
                {check.passed ? `+${check.points}` : `0`} pts
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
