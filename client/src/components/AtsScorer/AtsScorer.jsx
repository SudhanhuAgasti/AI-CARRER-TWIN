import React from 'react';
import { Check, X, ShieldAlert, FileCheck2, Info } from 'lucide-react';
import './AtsScorer.css';

/**
 * AtsScorer Component
 * Displays a radial gauge score, overall grade, and a list of deterministic ATS checks.
 * 
 * DESIGN RATIONALE:
 * - Uses plain SVG for the radial score gauge (highly performant and customisable).
 * - Separates checks into visual statuses (passed/failed) with sliding animation triggers.
 */
export default function AtsScorer({ atsData }) {
  const { score, maxScore, grade, checks } = atsData;

  // Circular gauge mathematics
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  // Grade color matching class names
  const gradeClasses = {
    A: 'grade-a',
    B: 'grade-b',
    C: 'grade-c',
    D: 'grade-d',
  };

  return (
    <div className="ats-scorer-container">
      
      {/* Gauge & Summary Header */}
      <div className="ats-score-header">
        
        {/* SVG Radial Progress Gauge */}
        <div className="radial-gauge-wrapper">
          <svg className="radial-svg" viewBox="0 0 140 140">
            <circle 
              className="radial-bg-circle" 
              cx="70" cy="70" r={radius} 
            />
            <circle 
              className="radial-progress-circle" 
              cx="70" cy="70" r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="gauge-text-container">
            <span className="gauge-score">{score}</span>
            <span className="gauge-max">/ {maxScore}</span>
          </div>
        </div>

        {/* Grade Display Panel */}
        <div className="score-summary-meta">
          <div className="summary-title-wrapper">
            <FileCheck2 className="summary-icon" />
            <h3>ATS Diagnostics</h3>
          </div>
          <p className="summary-desc">
            Your resume was evaluated against standard industrial parser rules.
          </p>
          <div className="badge-row">
            <div className={`grade-badge ${gradeClasses[grade] || 'grade-d'}`}>
              Grade {grade}
            </div>
            <div className="standard-badge">
              {score >= 80 ? 'Job Ready' : score >= 60 ? 'Strong Foundation' : 'Needs Optimization'}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="checks-list-container">
        <h4 className="checks-title">Validation Checks ({checks.filter(c => c.passed).length}/{checks.length})</h4>
        
        <div className="checks-grid">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className={`check-card ${check.passed ? 'check-passed' : 'check-failed'}`}
            >
              <div className="check-status-icon-wrapper">
                {check.passed ? (
                  <Check className="check-success-icon" />
                ) : (
                  <X className="check-error-icon" />
                )}
              </div>
              
              <div className="check-details">
                <p className="check-name">{check.name}</p>
                {check.detail && (
                  <div className="check-meta-row">
                    <Info className="check-info-icon" />
                    <span className="check-detail-text">{check.detail}</span>
                  </div>
                )}
              </div>

              <div className="check-points-badge">
                {check.passed ? `+${check.points}` : `0`} pts
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
