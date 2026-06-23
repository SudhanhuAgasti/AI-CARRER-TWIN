import React from 'react';
import { Plus } from 'lucide-react';

/**
 * ExperienceEditor Component
 * Manages work history entries listing, inputs, and deletion.
 */
export default function ExperienceEditor({ experience, onChange, onAdd, onRemove }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider">
          Work Experience
        </h5>
        <button 
          type="button" 
          className="bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all duration-200" 
          onClick={onAdd}
        >
          <Plus size={14} /> Add Job
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {experience.map((exp, expIdx) => (
          <div key={expIdx} className="bg-black/15 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h6 className="font-sans text-xs font-semibold text-slate-400">Job #{expIdx + 1}</h6>
              <button 
                type="button" 
                className="bg-transparent border-none text-red-400 text-xs font-medium cursor-pointer"
                onClick={() => onRemove(expIdx)}
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Job Title</label>
                <input 
                  type="text" 
                  className="bg-black/20 border border-white/5 rounded-lg px-4 py-2 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                  value={exp.title || ''} 
                  onChange={(e) => onChange('experience', expIdx, 'title', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Company</label>
                <input 
                  type="text" 
                  className="bg-black/20 border border-white/5 rounded-lg px-4 py-2 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                  value={exp.company || ''} 
                  onChange={(e) => onChange('experience', expIdx, 'company', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
