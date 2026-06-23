import React from 'react';

/**
 * JobDescInput Component
 * Renders optional job description textarea inputs.
 */
export default function JobDescInput({ value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label className="font-sans font-semibold text-sm text-slate-100">Target Job Description (Optional)</label>
      <textarea 
        className="bg-slate-900/40 border border-white/10 rounded-xl min-h-[120px] p-4 text-slate-100 font-sans text-sm resize-y focus:outline-none focus:border-violet-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all duration-200"
        placeholder="Paste the job requirements here to compute semantic matching scores..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
