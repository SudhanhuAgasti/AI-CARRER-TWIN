import React, { useState } from 'react';
import ContactInfoEditor from './ContactInfoEditor';
import SkillsEditor from './SkillsEditor';
import ExperienceEditor from './ExperienceEditor';

/**
 * ResumeEditor Component
 * Wraps the split preview pane and aggregates sub-component editors (Contact, Skills, Experience).
 * 
 * DESIGN RATIONALE:
 * - Decoupled sub-components keep form state changes localized.
 * - Simple layout makes future logic upgrades (e.g. adding education edits) trivial.
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
          
          {/* Sub-Editor 1: Contact Details */}
          <ContactInfoEditor 
            name={resume.name}
            email={resume.email}
            phone={resume.phone}
            onChange={handleFieldChange}
          />

          {/* Sub-Editor 2: Skills Tag Editor */}
          <SkillsEditor 
            skills={resume.skills || []}
            onChange={handleArrayChange}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
          />

          {/* Sub-Editor 3: Work History Editor */}
          <ExperienceEditor 
            experience={resume.experience || []}
            onChange={handleNestedFieldChange}
            onAdd={handleAddExperience}
            onRemove={handleRemoveExperience}
          />

        </form>
      </div>

    </div>
  );
}
