import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';
import './ResumeUploader.css';

/**
 * ResumeUploader Component
 * Handles drag-and-drop resume uploading, file validation, 
 * job description input, and triggers the analysis payload.
 * 
 * DESIGN RATIONALE:
 * - Direct responsive drag & drop interface.
 * - Prompts clear warnings for scanned documents and handles visual loading states.
 */
export default function ResumeUploader({ onAnalyze, isLoading }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ]);

  const handleFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (!allowedTypes.has(selectedFile.type)) {
      setError('Unsupported file format. Please upload PDF, DOCX, PNG, or JPEG.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a resume file first.');
      return;
    }
    onAnalyze(file, jobDescription);
  };

  return (
    <form className="uploader-form" onSubmit={handleSubmit}>
      {/* Drag & Drop Wrapper */}
      <div 
        className={`drag-container ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={!file ? triggerInput : undefined}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="file-input-hidden" 
          onChange={onFileChange}
          accept=".pdf,.docx,.png,.jpg,.jpeg"
        />

        {!file ? (
          <div className="upload-prompt">
            <div className="icon-wrapper">
              <Upload className="upload-icon" />
            </div>
            <p className="upload-primary-text">Drag & Drop your resume or <span>browse</span></p>
            <p className="upload-sub-text">Supports PDF, DOCX, PNG, and JPEG (Max 5MB)</p>
          </div>
        ) : (
          <div className="file-info-container">
            <div className="file-icon-wrapper">
              <FileText className="file-icon" />
            </div>
            <div className="file-meta">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              type="button" 
              className="remove-file-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              disabled={isLoading}
            >
              Change
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {/* Optional Job Description Input */}
      <div className="jd-input-container">
        <label className="jd-label">Target Job Description (Optional)</label>
        <textarea 
          className="jd-textarea"
          placeholder="Paste the job requirements here to compute semantic matching scores..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Action Button */}
      <button 
        type="submit" 
        className="submit-analyze-btn" 
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <div className="loading-spinner-wrapper">
            <span className="spinner"></span>
            <span>Running AI Diagnostics...</span>
          </div>
        ) : (
          <>
            <Sparkles className="btn-sparkle-icon" />
            <span>Analyze Resume & Compute ATS</span>
          </>
        )}
      </button>
    </form>
  );
}
