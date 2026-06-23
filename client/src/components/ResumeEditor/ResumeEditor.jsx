import React, { useState } from 'react';
import { User, Mail, Phone, Plus, Trash } from 'lucide-react';

/**
 * ResumeEditor Component (Refactored with Tailwind CSS v4)
 * Allows user to view the extracted resume details and edit fields interactively.
 */
export default function ResumeEditor({ structuredResume, rawText, onSave }) {
  const [resume, setResume] = useState({ ...structuredResume });

  const handleFieldChange = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (section, index, field, value) => {
    setResume((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = { ...updatedSection[index], [field]: value };
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleArrayChange = (field, index, value) => {
    setResume((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleAddExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', durationMonths: 0, bulletPoints: [] }
      ]
    }));
  };

  const handleRemoveExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const handleRemoveSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(resume);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 w-full lg:h-[650px] text-left">
      
      {/* Left Column: Raw Extracted Document Preview */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col h-full">
        <h4 className="font-sans text-sm font-semibold text-slate-50 uppercase tracking-wider mb-4">Raw Document Text</h4>
        <div className="bg-black/25 border border-white/3 rounded-xl p-4 overflow-y-auto grow font-mono text-xs text-slate-400 pre-wrap break-all">
          <pre className="whitespace-pre-wrap">{rawText}</pre>
        </div>
      </div>

      {/* Right Column: Interactive Editor Form */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-sans text-sm font-semibold text-slate-50 uppercase tracking-wider mb-0">Edit Extracted Profile</h4>
          <button className="bg-violet-500 hover:bg-violet-600 text-white px-5 py-2 rounded-lg font-sans font-bold text-xs cursor-pointer transition-all duration-200" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>

        <form className="overflow-y-auto grow flex flex-col gap-6 pr-2" onSubmit={handleSubmit}>
          {/* Contact Details Section */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
            <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider border-b border-white/5 pb-2">
              Contact Information
            </h5>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
                <User className="w-3 h-3 text-cyan-400" /> Full Name
              </label>
              <input 
                type="text" 
                className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                value={resume.name || ''} 
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-cyan-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                  value={resume.email || ''} 
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-cyan-400" /> Phone Number
                </label>
                <input 
                  type="text" 
                  className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                  value={resume.phone || ''} 
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider">
                Skills & Competencies
              </h5>
              <button type="button" className="bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all duration-200" onClick={handleAddSkill}>
                <Plus size={14} /> Add Skill
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {resume.skills.map((skill, index) => (
                <div key={index} className="flex items-center bg-black/15 border border-white/5 rounded-lg p-1">
                  <input 
                    type="text" 
                    className="bg-transparent border-none text-slate-100 font-sans text-xs px-2 py-1.5 w-full focus:outline-none"
                    value={skill} 
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="bg-transparent border-none text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1 rounded cursor-pointer transition-all"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider">
                Work Experience
              </h5>
              <button type="button" className="bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all duration-200" onClick={handleAddExperience}>
                <Plus size={14} /> Add Job
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {resume.experience.map((exp, expIdx) => (
                <div key={expIdx} className="bg-black/15 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h6 className="font-sans text-xs font-semibold text-slate-400">Job #{expIdx + 1}</h6>
                    <button 
                      type="button" 
                      className="bg-transparent border-none text-red-400 text-xs font-medium cursor-pointer"
                      onClick={() => handleRemoveExperience(expIdx)}
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
                        onChange={(e) => handleNestedFieldChange('experience', expIdx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-400">Company</label>
                      <input 
                        type="text" 
                        className="bg-black/20 border border-white/5 rounded-lg px-4 py-2 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
                        value={exp.company || ''} 
                        onChange={(e) => handleNestedFieldChange('experience', expIdx, 'company', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
