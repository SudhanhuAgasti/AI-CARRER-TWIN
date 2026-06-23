import React, { useState, useRef } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import UploadDropzone from './UploadDropzone';
import JobDescInput from './JobDescInput';

/**
 * ResumeUploader Component
 * Coordinates selected file validation inputs, drop zones, and submission actions.
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
    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
      {/* Sub-Component 1: Upload Dropzone area */}
      <UploadDropzone 
        file={file}
        dragActive={dragActive}
        onDrag={onDrag}
        onDrop={onDrop}
        triggerInput={triggerInput}
        onFileChange={onFileChange}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        setFile={setFile}
      />

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Sub-Component 2: Job description comparison text block */}
      <JobDescInput 
        value={jobDescription}
        onChange={setJobDescription}
        disabled={isLoading}
      />

      {/* Action Button */}
      <button 
        type="submit" 
        className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:shadow-[0_6px_20px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 disabled:bg-white/5 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border-none text-white py-4 px-8 rounded-xl font-sans font-bold text-base flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(139,92,246,0.2)]" 
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></span>
            <span>Running AI Diagnostics...</span>
          </div>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Analyze Resume & Compute ATS</span>
          </>
        )}
      </button>
    </form>
  );
}
