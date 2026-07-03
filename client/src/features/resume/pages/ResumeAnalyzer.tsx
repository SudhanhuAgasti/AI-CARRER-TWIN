/**
 * @file ResumeAnalyzer.tsx
 * @description Parent Resume parser workspace handling tabs switcher, uploaders, and reports.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import ResumeUploader from '../components/ResumeUploader';
import AtsReport from '../components/AtsReport';
import ResumeMorpher from '../components/ResumeMorpher';
import { Cpu, CheckSquare } from 'lucide-react';

type ActiveTab = 'ats' | 'morpher';

export function ResumeAnalyzer() {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('ats');

  const handleUploadSuccess = (uploadedFileName: string, _content: string) => {
    setFileName(uploadedFileName);
    setResumeUploaded(true);
  };

  const handleReset = () => {
    setResumeUploaded(false);
    setFileName('');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Resume Parser & ATS Workspace</h1>
          <p className="text-xs text-muted-foreground">
            {resumeUploaded
              ? `Workspace active: ${fileName}`
              : 'Upload your resume PDF/DOCX to get started with ATS analysis and rephrasing.'}
          </p>
        </div>
        
        {resumeUploaded && (
          <button
            onClick={handleReset}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors self-start sm:self-center"
          >
            Upload Different Resume
          </button>
        )}
      </div>

      {!resumeUploaded ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* Tab Switcher controls */}
          <div className="flex border-b border-border/40 gap-4">
            <button
              onClick={() => setActiveTab('ats')}
              className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all select-none
                ${activeTab === 'ats'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Cpu className="h-4 w-4" />
              ATS Overlap Analyzer
            </button>
            
            <button
              onClick={() => setActiveTab('morpher')}
              className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all select-none
                ${activeTab === 'morpher'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <CheckSquare className="h-4 w-4" />
              Resume Morpher playground
            </button>
          </div>

          {/* Render Tab Contents */}
          <div className="animate-in fade-in duration-200">
            {activeTab === 'ats' ? (
              <AtsReport score={82} />
            ) : (
              <ResumeMorpher />
            )}
          </div>

        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;
