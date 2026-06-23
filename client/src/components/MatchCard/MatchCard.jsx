import React from 'react';
import MatchScorePanel from './MatchScorePanel';
import KeywordList from './KeywordList';

/**
 * MatchCard Component
 * Orchestrates the score rating panel and matching keywords list tags.
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

  return (
    <div className={`relative overflow-hidden flex flex-col gap-6 bg-slate-900/40 backdrop-blur-md border rounded-2xl p-8 shadow-2xl shadow-black/50 transition-all duration-300 ${getMatchThemeClass(similarityScore)}`}>
      {/* Sub-Component 1: Semantic match score circles */}
      <MatchScorePanel similarityScore={similarityScore} interpretation={interpretation} />

      {/* Sub-Component 2: Matched tags mapping lists */}
      <KeywordList matchedKeywords={matchedKeywords} overlapPercent={overlapPercent} />
    </div>
  );
}
