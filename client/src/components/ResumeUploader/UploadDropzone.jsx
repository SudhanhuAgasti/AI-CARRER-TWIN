import React from 'react';
import { Upload, FileText } from 'lucide-react';

/**
 * UploadDropzone Component
 * Handles drag-over drops and selected file display indicators.
 */
export default function UploadDropzone({ 
  file, 
  dragActive, 
  onDrag, 
  onDrop, 
  triggerInput, 
  onFileChange, 
  fileInputRef, 
  isLoading, 
  setFile 
}) {
  return (
    <div 
      className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out backdrop-blur-md cursor-pointer
        ${dragActive 
          ? 'border-cyan-500 bg-slate-900/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
          : 'border-white/10 bg-slate-900/40 hover:border-violet-500 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
        } 
        ${file ? 'border-solid border-white/20 cursor-default p-8' : ''}`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      onClick={!file ? triggerInput : undefined}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        onChange={onFileChange}
        accept=".pdf,.docx,.png,.jpg,.jpeg"
      />

      {!file ? (
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white/3 border border-white/8 rounded-full p-4 flex items-center justify-center mb-2 transition-transform duration-300 hover:-translate-y-1 hover:border-violet-500/40">
            <Upload className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-sans font-medium text-[1.05rem] text-slate-100">
            Drag & Drop your resume or <span className="text-violet-500 underline underline-offset-4 font-semibold">browse</span>
          </p>
          <p className="text-xs text-slate-400">Supports PDF, DOCX, PNG, and JPEG (Max 5MB)</p>
        </div>
      ) : (
        <div className="flex items-center gap-5 text-left">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 flex items-center justify-center">
            <FileText className="w-6 h-6 text-violet-500" />
          </div>
          <div className="grow">
            <p className="font-sans font-semibold text-base text-slate-100 break-all mb-1">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button 
            type="button" 
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-100 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200" 
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
  );
}
