import React from 'react';
import { Plus, Trash } from 'lucide-react';

/**
 * SkillsEditor Component
 * Manages skills list editing, addition, and removal.
 */
export default function SkillsEditor({ skills, onChange, onAdd, onRemove }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider">
          Skills & Competencies
        </h5>
        <button 
          type="button" 
          className="bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all duration-200" 
          onClick={onAdd}
        >
          <Plus size={14} /> Add Skill
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center bg-black/15 border border-white/5 rounded-lg p-1">
            <input 
              type="text" 
              className="bg-transparent border-none text-slate-100 font-sans text-xs px-2 py-1.5 w-full focus:outline-none"
              value={skill} 
              onChange={(e) => onChange('skills', index, e.target.value)}
            />
            <button 
              type="button" 
              className="bg-transparent border-none text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1 rounded cursor-pointer transition-all"
              onClick={() => onRemove(index)}
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
