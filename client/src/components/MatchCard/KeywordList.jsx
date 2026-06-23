import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';

/**
 * KeywordList Component
 * Renders lists of matching target skill keywords.
 */
export default function KeywordList({ matchedKeywords, overlapPercent }) {
  if (!matchedKeywords || matchedKeywords.length === 0) return null;

  return (
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
  );
}
