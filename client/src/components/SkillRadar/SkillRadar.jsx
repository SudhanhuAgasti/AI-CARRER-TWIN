import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * SkillRadar Component (Tailwind CSS v4)
 * Displays visual comparisons of possessed skills vs. target requirements.
 */
export default function SkillRadar({ resumeSkills = [], requiredGaps = [], preferredGaps = [], targetRole }) {
  // Normalize comparisons
  const matchedSkills = resumeSkills.filter(
    (skill) => 
      !requiredGaps.some(g => g.toLowerCase() === skill.toLowerCase()) &&
      !preferredGaps.some(g => g.toLowerCase() === skill.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
        <h3 className="font-sans text-lg font-bold text-slate-50 mb-2">Skill Gaps Analysis</h3>
        <p className="text-sm text-slate-400 mb-6">
          Comparing your current resume profile against target requirements for **{targetRole}**.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Required Gaps */}
          {requiredGaps.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5">
              <h4 className="font-sans text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Required Skills Missing
              </h4>
              <div className="flex flex-wrap gap-2">
                {requiredGaps.map((skill, index) => (
                  <span key={index} className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Preferred Gaps */}
          {preferredGaps.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5">
              <h4 className="font-sans text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Preferred Skills Missing
              </h4>
              <div className="flex flex-wrap gap-2">
                {preferredGaps.map((skill, index) => (
                  <span key={index} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Matched / Shared Skills */}
        {matchedSkills.length > 0 && (
          <div className="mt-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
            <h4 className="font-sans text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Matching Skills Present
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, index) => (
                <span key={index} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
