/**
 * @file ResumeUploader.tsx
 * @description Drag-and-drop file uploader component with state variables.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface ResumeUploaderProps {
  onUploadSuccess: (fileName: string, parsedContent: string) => void;
}

export function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (selectedFile: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // Simulate parser API latency
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockParsedContent = `
        Sudhanshu Agasti
        Senior Software Engineer
        
        Summary: Full Stack developer with experience in React, NodeJS, Express, and Database Architectures.
        
        Experience:
        - Built isolated Docker execution environments for coding playground interfaces.
        - Designed standard MongoDB routing endpoints with Express.js backends.
        - Configured custom CSS styling themes utilizing HSL color properties.
      `;
      
      onUploadSuccess(file.name, mockParsedContent);
    } catch (err) {
      setError('Error parsing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors select-none
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-card'}
          ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
        />

        {!file ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Drag and drop your resume file</p>
              <p className="text-xs text-muted-foreground">PDF or DOCX format (Max 5MB)</p>
            </div>
            <Button variant="outline" size="sm" onClick={onButtonClick}>
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => setFile(null)} disabled={loading}>
                Clear
              </Button>
              <Button size="sm" onClick={handleAnalyze} isLoading={loading}>
                Analyze Resume
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
