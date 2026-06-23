import React from 'react';
import { Target, CheckCircle2, Bookmark } from 'lucide-react';
import './MatchCard.css';

/**
 * MatchCard Component
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
    if (score >= 80) return 'match-strong';
    if (score >= 60) return 'match-moderate';
    return 'match-weak';
  };

  const themeClass = getMatchThemeClass(similarityScore);

  return (
    <div className={`match-card-container ${themeClass}`}>
      
      {/* Title Header */}
      <div className="match-title-row">
        <Target className="match-icon" />
        <h3>Job Description Fit</h3>
      </div>

      {/* Main Score Panel */}
      <div className="match-score-grid">
        <div className="match-score-big">
          <span className="big-percent">{similarityScore}%</span>
          <span className="big-label">Semantic Match</span>
        </div>

        <div className="match-status-info">
          <h4 className="match-status-text">{interpretation}</h4>
          <p className="match-explanation">
            This rating represents the semantic overlap between your resume text and the job description, computed using vector embeddings.
          </p>
        </div>
      </div>

      {/* Keyword Overlap Details */}
      {matchedKeywords.length > 0 && (
        <div className="keyword-section">
          <div className="keyword-header">
            <Bookmark className="keyword-icon" />
            <span>Keyword Match ({overlapPercent}% Density)</span>
          </div>
          
          <div className="keywords-tags-container">
            {matchedKeywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">
                <CheckCircle2 className="tag-check-icon" />
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
