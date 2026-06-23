import React from 'react';
import AtsGauge from './AtsGauge';
import AtsCheckList from './AtsCheckList';

/**
 * AtsScorer Component
 * Orchestrates the radial gauge and diagnostics checklist sub-components.
 */
export default function AtsScorer({ atsData }) {
  const { score, maxScore, grade, checks } = atsData;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Sub-Component 1: Circular SVG Score Gauge */}
      <AtsGauge score={score} maxScore={maxScore} grade={grade} />

      {/* Sub-Component 2: Checklists Verification List Grid */}
      <AtsCheckList checks={checks || []} />
    </div>
  );
}
