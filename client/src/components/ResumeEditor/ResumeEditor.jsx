import React, { useState } from 'react';
import { User, Mail, Phone, Edit, Calendar, Plus, Trash } from 'lucide-react';
import './ResumeEditor.css';

/**
 * ResumeEditor Component
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
    <div className="resume-editor-workspace">
      
      {/* Left Column: Raw Extracted Document Preview */}
      <div className="preview-pane">
        <h4 className="pane-title">Raw Document Text</h4>
        <div className="raw-text-viewer">
          <pre>{rawText}</pre>
        </div>
      </div>

      {/* Right Column: Interactive Editor Form */}
      <div className="editor-pane">
        <div className="pane-header-row">
          <h4 className="pane-title">Edit Extracted Profile</h4>
          <button className="editor-save-btn" onClick={handleSubmit}>Save Changes</button>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          {/* Contact Details Section */}
          <div className="form-section-card">
            <h5 className="section-card-title">Contact Information</h5>
            
            <div className="field-group">
              <label><User className="label-icon" /> Full Name</label>
              <input 
                type="text" 
                value={resume.name || ''} 
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>

            <div className="fields-row-double">
              <div className="field-group">
                <label><Mail className="label-icon" /> Email Address</label>
                <input 
                  type="email" 
                  value={resume.email || ''} 
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              <div className="field-group">
                <label><Phone className="label-icon" /> Phone Number</label>
                <input 
                  type="text" 
                  value={resume.phone || ''} 
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-section-card">
            <div className="section-card-header-with-btn">
              <h5 className="section-card-title">Skills & Competencies</h5>
              <button type="button" className="small-add-btn" onClick={handleAddSkill}>
                <Plus size={14} /> Add Skill
              </button>
            </div>
            
            <div className="skills-edit-grid">
              {resume.skills.map((skill, index) => (
                <div key={index} className="skill-input-wrapper">
                  <input 
                    type="text" 
                    value={skill} 
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="skill-remove-btn"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="form-section-card">
            <div className="section-card-header-with-btn">
              <h5 className="section-card-title">Work Experience</h5>
              <button type="button" className="small-add-btn" onClick={handleAddExperience}>
                <Plus size={14} /> Add Job
              </button>
            </div>

            <div className="experience-edit-list">
              {resume.experience.map((exp, expIdx) => (
                <div key={expIdx} className="nested-exp-card">
                  <div className="nested-card-header">
                    <h6>Job #{expIdx + 1}</h6>
                    <button 
                      type="button" 
                      className="nested-remove-btn"
                      onClick={() => handleRemoveExperience(expIdx)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="fields-row-double">
                    <div className="field-group">
                      <label>Job Title</label>
                      <input 
                        type="text" 
                        value={exp.title || ''} 
                        onChange={(e) => handleNestedFieldChange('experience', expIdx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label>Company</label>
                      <input 
                        type="text" 
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
