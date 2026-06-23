import React from 'react';
import { Check, X, Info } from 'lucide-react';

/**
 * AtsCheckList Component
 * Displays a list grid of deterministic verification checks.
 */
export default function AtsCheckList({ checks }) {
  return (
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
  );
}
