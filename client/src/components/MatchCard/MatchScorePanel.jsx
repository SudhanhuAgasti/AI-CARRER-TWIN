import React from 'react';
import { Target } from 'lucide-react';

/**
 * MatchScorePanel Component
 * Displays similarity score circle and interpretation details.
 */
export default function MatchScorePanel({ similarityScore, interpretation }) {
  const getPercentageColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-cyan-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Title Header */}
      <div className="flex items-center gap-2 z-10 text-left">
        <Target className="w-5 h-5 text-cyan-400" />
        <h3 className="font-sans text-lg font-bold text-slate-50">Job Description Fit</h3>
      </div>

      {/* Main Score Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 sm:gap-8 items-center z-10 text-left">
        <div className="flex flex-col items-center justify-center bg-white/2 border border-white/5 p-4 sm:p-6 rounded-2xl aspect-square max-w-[140px] mx-auto sm:mx-0 w-full">
          <span className={`font-sans text-[2.2rem] font-bold leading-none ${getPercentageColor(similarityScore)}`}>
            {similarityScore}%
          </span>
          <span className="text-[10px] text-slate-400 mt-2 tracking-wider uppercase text-center">
            Semantic Match
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-sans text-xl font-bold text-slate-50">{interpretation}</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            This rating represents the semantic overlap between your resume text and the job description, computed using vector embeddings.
          </p>
        </div>
      </div>
    </>
  );
}
