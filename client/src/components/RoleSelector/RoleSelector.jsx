import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, Sparkles } from 'lucide-react';

/**
 * RoleSelector Component (Tailwind CSS v4)
 * Allows candidate to select target career profile and configure available study hours.
 * Fetches options dynamically from backend taxonomy.
 */
export default function RoleSelector({ onGenerate, isLoading, resumeSkills }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [hours, setHours] = useState(2);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch supported roles from backend taxonomy
    fetch('http://localhost:4000/api/planner/roles')
      .then((res) => res.json())
      .then((data) => {
        if (data.roles) {
          setRoles(data.roles);
          if (data.roles.length > 0) {
            setSelectedRole(data.roles[0].key);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching taxonomy roles:', err);
        // Fallback static roles if server connection fails
        const fallbackRoles = [
          { key: 'backend-engineer', title: 'Backend Engineer' },
          { key: 'frontend-engineer', title: 'Frontend Engineer' },
          { key: 'fullstack-engineer', title: 'Fullstack Engineer' },
          { key: 'devops-engineer', title: 'DevOps Engineer' }
        ];
        setRoles(fallbackRoles);
        setSelectedRole(fallbackRoles[0].key);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a target role first.');
      return;
    }
    onGenerate(selectedRole, hours);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 text-left">
      <h3 className="font-sans text-lg font-bold text-slate-50 mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-violet-400" /> Configure Career Roadmap
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Role Selector Field */}
        <div className="flex flex-col gap-2">
          <label className="font-sans font-semibold text-sm text-slate-200">Target Career Profile</label>
          <select 
            className="bg-slate-950 border border-white/10 text-slate-100 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-violet-500 cursor-pointer w-full transition-all duration-200"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={isLoading}
          >
            {roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.title}
              </option>
            ))}
          </select>
        </div>

        {/* Study Hours Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-sans font-semibold text-sm text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Study Bandwidth
            </label>
            <span className="text-sm font-bold text-cyan-400 font-sans bg-cyan-400/10 px-3 py-1 rounded-md">
              {hours} Hours / Day
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            className="w-full accent-cyan-400 bg-white/5 border border-white/5 rounded-lg h-2 cursor-pointer"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            disabled={isLoading}
          />
          <span className="text-[10px] text-slate-400 text-right">
            Total {hours * 7} hours allocated per week.
          </span>
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {/* Action button */}
        <button 
          type="submit" 
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:shadow-[0_6px_20px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 disabled:bg-white/5 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border-none text-white py-3.5 px-6 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(139,92,246,0.2)] w-full"
          disabled={isLoading || !selectedRole}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin"></span>
              <span>Planning Learning Paths...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Roadmap</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
