import React from 'react';
import { Target, CheckCircle2, Bookmark } from 'lucide-react';

/**
 * MatchCard Component (Refactored with Tailwind CSS v4)
 * Displays the semantic match score against a job description,
 * matched keywords, and rating interpretation.
 */
export default function MatchCard({ matchData, keywordOverlap }) {
  if (!matchData) return null;

  const { similarityScore, interpretation } = matchData;
  const matchedKeywords = keywordOverlap?.matchedKeywords || [];
  const overlapPercent = keywordOverlap?.overlapPercent || 0;

  // Custom visual theme based on match quality
  const getMatchThemeClass = (score) => {
    if (score >= 80) return 'border-emerald-500/20';
    if (score >= 60) return 'border-cyan-500/20';
    return 'border-red-500/20';
  };

  const getPercentageColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-cyan-400';
    return 'text-red-400';
  };

  return (
    <div className={`relative overflow-hidden flex flex-col gap-6 bg-slate-900/40 backdrop-blur-md border rounded-2xl p-8 shadow-2xl shadow-black/50 transition-all duration-300 ${getMatchThemeClass(similarityScore)}`}>
      
      {/* Title Header */}
      <div className="flex items-center gap-2 z-10 text-left">
        <Target className="w-5 h-5 text-cyan-400" />
        <h3 className="font-sans text-lg font-bold text-slate-50">Job Description Fit</h3>
      </div>

      {/* Main Score Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-8 items-center z-10 text-left">
        <div className="flex flex-col items-center justify-center bg-white/2 border border-white/5 p-6 rounded-2xl aspect-square">
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

      {/* Keyword Overlap Details */}
      {matchedKeywords.length > 0 && (
        <div className="flex flex-col gap-3 z-10 text-left">
          <div className="flex items-center gap-1.5 font-sans font-semibold text-xs text-slate-400 uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Keyword Match ({overlapPercent}% Density)</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((keyword, index) => (
              <span key={index} className="bg-white/2 border border-white/5 text-slate-50 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
