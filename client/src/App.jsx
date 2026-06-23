import React, { useState } from 'react';
import { ShieldCheck, CalendarRange, Eye, Edit3, ArrowLeft } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader/ResumeUploader';
import AtsScorer from './components/AtsScorer/AtsScorer';
import MatchCard from './components/MatchCard/MatchCard';
import ResumeEditor from './components/ResumeEditor/ResumeEditor';

// Import Global Styles
import './styles/global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'roadmap'
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [analysisError, setAnalysisError] = useState(null);

  const API_BASE_URL = 'http://localhost:4000/api';

  // Triggers Phase 1 Analysis API
  const handleAnalyzeResume = async (file, jobDescription) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    setEditMode(false);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Parsing failed.');
      }

      const result = await response.json();
      setAnalysisResult(result);
      // We keep a backup of raw text for the side-by-side editor preview
      setRawText(result.structuredResume.rawText || file.name + ' parsed content...');
    } catch (error) {
      console.error('Analysis error:', error);
      // Catch Google API 503 errors and make them readable
      if (error.message.includes('503') || error.message.includes('UNAVAILABLE')) {
        setAnalysisError('Google AI servers are currently overloaded (503 Service Unavailable). Please click the analyze button again to retry.');
      } else {
        setAnalysisError(error.message || 'Something went wrong during analysis. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEditedResume = (updatedStructured) => {
    setAnalysisResult((prev) => ({
      ...prev,
      structuredResume: updatedStructured,
    }));
    setEditMode(false);
  };

  return (
    <>
      {/* Animated Mesh Blobs in Background */}
      <div className="ambient-bg">
        <div className="blob blob-purple"></div>
        <div className="blob blob-cyan"></div>
      </div>

      {/* Global SVG Gradients Template (used by radial gauge strokes) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="cyan-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header Branding */}
        <header className="flex flex-col items-center text-center gap-3 mb-12">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-6 h-6 rounded-full border-2 border-violet-500 flex items-center justify-center relative shadow-[0_0_10px_rgba(139,92,246,0.25)]">
              <span className="w-2 h-2 rounded-full background-cyan-400 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.25)]"></span>
            </div>
            <h1 className="font-sans text-[1.8rem] font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              AI Career Twin
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-[480px] leading-relaxed">
            Evaluate, optimize, and map your career trajectory with deterministic AI diagnostics.
          </p>

          {/* Navigation Tabs */}
          <nav className="flex bg-white/2 border border-white/5 p-1.5 rounded-full mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <button 
              className={`bg-transparent border-none text-slate-400 px-6 py-2.5 rounded-full font-sans font-medium text-xs cursor-pointer flex items-center gap-2 transition-all duration-200
                ${activeTab === 'resume' ? 'text-white bg-violet-500/15 border border-violet-500/25 shadow-[0_4px_12px_rgba(139,92,246,0.25)]' : 'hover:text-slate-100 hover:bg-white/3'}`}
              onClick={() => setActiveTab('resume')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS Resume Scorer</span>
            </button>
            <button 
              className="bg-transparent border-none text-slate-400 px-6 py-2.5 rounded-full font-sans font-medium text-xs opacity-35 cursor-not-allowed flex items-center gap-2"
              disabled={true}
              title="Phase 2 integration coming soon"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Roadmap Planner (Phase 2)</span>
            </button>
          </nav>
        </header>

        {/* Content body */}
        <main className="w-full">
          {activeTab === 'resume' && (
            <div className="w-full">
              
              {!analysisResult ? (
                <div className="max-w-[640px] mx-auto flex flex-col gap-8 mt-8">
                  <div className="text-center flex flex-col gap-2">
                    <h2 className="font-sans text-xl font-bold text-slate-50">Optimize Your Resume for ATS Parsers</h2>
                    <p className="text-sm text-slate-400">Upload your file to extract structured fields and compute deterministic scoring benchmarks.</p>
                  </div>

                  {analysisError && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-sm text-left">
                      <p>{analysisError}</p>
                    </div>
                  )}

                  <ResumeUploader onAnalyze={handleAnalyzeResume} isLoading={isLoading} />
                </div>
              ) : (
                <div className="animate-[fadeIn_0.4s_ease-out] flex flex-col gap-6">
                  
                  {/* Results Sub-header Navigation */}
                  <div className="flex justify-between items-center mb-2">
                    <button className="bg-transparent border-none text-slate-400 hover:text-slate-100 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors duration-200" onClick={() => setAnalysisResult(null)}>
                      <ArrowLeft size={16} /> Back to Upload
                    </button>

                    <div className="flex bg-white/2 border border-white/5 p-1 rounded-lg">
                      <button 
                        className={`bg-transparent border-none text-slate-400 px-4 py-2 rounded-md font-sans font-medium text-xs cursor-pointer flex items-center gap-1.5 transition-all duration-200
                          ${!editMode ? 'text-white bg-white/6 border border-white/5' : ''}`}
                        onClick={() => setEditMode(false)}
                      >
                        <Eye size={14} /> Scorecard
                      </button>
                      <button 
                        className={`bg-transparent border-none text-slate-400 px-4 py-2 rounded-md font-sans font-medium text-xs cursor-pointer flex items-center gap-1.5 transition-all duration-200
                          ${editMode ? 'text-white bg-white/6 border border-white/5' : ''}`}
                        onClick={() => setEditMode(true)}
                      >
                        <Edit3 size={14} /> Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Switch View (Scorecard vs Editor Workspace) */}
                  {!editMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
                      <div className="w-full">
                        <AtsScorer atsData={analysisResult.ats} />
                      </div>
                      <div className="w-full">
                        {analysisResult.match ? (
                          <MatchCard 
                            matchData={analysisResult.match} 
                            keywordOverlap={analysisResult.ats.keywordOverlap} 
                          />
                        ) : (
                          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl text-center text-slate-400 text-sm leading-relaxed shadow-2xl shadow-black/50">
                            <p>No Job Description was provided. Upload a Job Description to calculate semantic matching and keyword density analysis.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <ResumeEditor 
                      structuredResume={analysisResult.structuredResume}
                      rawText={rawText}
                      onSave={handleSaveEditedResume}
                    />
                  )}

                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </>
  );
}
