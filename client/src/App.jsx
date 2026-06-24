import React, { useState } from 'react';
import { ShieldCheck, CalendarRange, Eye, Edit3, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader/ResumeUploader';
import AtsScorer from './components/AtsScorer/AtsScorer';
import MatchCard from './components/MatchCard/MatchCard';
import ResumeEditor from './components/ResumeEditor/ResumeEditor';
import RoleSelector from './components/RoleSelector/RoleSelector';
import SkillRadar from './components/SkillRadar/SkillRadar';
import RoadmapTimeline from './components/RoadmapTimeline/RoadmapTimeline';

// Import Global Styles
import './styles/global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'roadmap'
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [analysisError, setAnalysisError] = useState(null);

  // Phase 2 states
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

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
      setRawText(result.structuredResume.rawText || file.name + ' parsed content...');
    } catch (error) {
      console.error('Analysis error:', error);
      if (error.message.includes('429') || error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate-limit') || error.message.toLowerCase().includes('resource_exhausted')) {
        setAnalysisError('Gemini API Quota Exceeded (429 Too Many Requests). You have hit the 20 requests/day limit on the Free Tier. Please update your API Key or try again later.');
      } else if (error.message.includes('503') || error.message.includes('UNAVAILABLE')) {
        setAnalysisError('Google AI servers are currently overloaded (503 Service Unavailable). Please click the analyze button again to retry.');
      } else {
        setAnalysisError(error.message || 'Something went wrong during analysis. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Triggers Phase 2 Roadmap Generation API
  const handleGenerateRoadmap = async (targetRole, availableHoursPerDay) => {
    setIsRoadmapLoading(true);
    setAnalysisError(null);

    // Pull skills from the uploaded resume if present
    const resumeSkills = analysisResult?.structuredResume?.skills || [];
    const resumeId = analysisResult?.ids?.resumeId || null;

    try {
      const response = await fetch(`${API_BASE_URL}/planner/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          resumeSkills,
          targetRole,
          availableHoursPerDay,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Planning failed.');
      }

      const result = await response.json();
      setRoadmapResult(result);
    } catch (error) {
      console.error('Roadmap planning error:', error);
      alert(`Error planning roadmap: ${error.message}`);
    } finally {
      setIsRoadmapLoading(false);
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
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.25)]"></span>
            </div>
            <h1 className="font-sans text-[1.8rem] font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              AI Career Twin
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-[480px] leading-relaxed">
            Evaluate, optimize, and map your career trajectory with deterministic AI diagnostics.
          </p>

          {/* Navigation Tabs */}
          <nav className="flex flex-col sm:flex-row bg-white/2 border border-white/5 p-1.5 rounded-2xl sm:rounded-full mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] w-full sm:w-auto gap-1">
            <button 
              className={`bg-transparent border-none text-slate-400 px-6 py-2.5 rounded-xl sm:rounded-full font-sans font-medium text-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-auto
                ${activeTab === 'resume' ? 'text-white bg-violet-500/15 border border-violet-500/25 shadow-[0_4px_12px_rgba(139,92,246,0.25)]' : 'hover:text-slate-100 hover:bg-white/3'}`}
              onClick={() => setActiveTab('resume')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS Resume Scorer</span>
            </button>
            <button 
              className={`bg-transparent border-none text-slate-400 px-6 py-2.5 rounded-xl sm:rounded-full font-sans font-medium text-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-auto
                ${activeTab === 'roadmap' ? 'text-white bg-violet-500/15 border border-violet-500/25 shadow-[0_4px_12px_rgba(139,92,246,0.25)]' : 'hover:text-slate-100 hover:bg-white/3'}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Roadmap Planner (Phase 2)</span>
            </button>
          </nav>
        </header>

        {/* Content body */}
        <main className="w-full">
          {/* Tab 1: Resume Scorer */}
          {activeTab === 'resume' && (
            <div className="w-full">
              {!analysisResult ? (
                <div className="max-w-[640px] mx-auto flex flex-col gap-8 mt-8">
                  <div className="text-center flex flex-col gap-2">
                    <h2 className="font-sans text-xl font-bold text-slate-50">Optimize Your Resume for ATS Parsers</h2>
                    <p className="text-sm text-slate-400">Upload your file to extract structured fields and compute deterministic scoring benchmarks.</p>
                  </div>

                  {analysisError && (
                    <div className="flex flex-col gap-3 bg-red-500/10 backdrop-blur-md border border-red-500/20 p-6 rounded-2xl text-red-200 text-sm text-left shadow-lg shadow-red-500/5 transition-all duration-300">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                        <span className="font-bold text-slate-100">API Diagnostics Suspended</span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {analysisError}
                      </p>
                      <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 mt-1 font-mono text-[11px] text-slate-300 leading-normal">
                        <span className="text-slate-500">// Update key in server/.env</span><br/>
                        GEMINI_API_KEY=<span className="text-cyan-400">your_new_gemini_key</span>
                      </div>
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

                  {/* Switch View (Scorecard vs Editor Workspace) */}
                  {!editMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
                      <div className="w-full flex flex-col gap-6">
                        <AtsScorer atsData={analysisResult.ats} />
                        
                        {/* Premium Action: Link directly to Phase 2 Planner */}
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                          <div>
                            <h4 className="font-sans font-bold text-sm text-slate-100 mb-1">Bridge Your Gaps</h4>
                            <p className="text-xs text-slate-400">Generate a custom week-by-week study roadmap based on your extracted resume skills.</p>
                          </div>
                          <button 
                            className="bg-violet-500 hover:bg-violet-600 text-white font-sans font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer"
                            onClick={() => setActiveTab('roadmap')}
                          >
                            <span>Generate Study Roadmap</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
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

          {/* Tab 2: Roadmap Planner */}
          {activeTab === 'roadmap' && (
            <div className="w-full">
              {!roadmapResult ? (
                <div className="max-w-[540px] mx-auto flex flex-col gap-6 mt-8">
                  <div className="text-center flex flex-col gap-2">
                    <h2 className="font-sans text-xl font-bold text-slate-50">Custom Study Planner</h2>
                    <p className="text-sm text-slate-400">
                      Select your target career path to compute skills gap matrices and generate custom roadmaps.
                    </p>
                  </div>
                  
                  {/* Warning if no resume uploaded yet */}
                  {!analysisResult && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-300 text-xs text-left">
                      <p>Note: No resume has been uploaded yet. The roadmap will assume you are starting from scratch. Upload a resume first to extract existing skills.</p>
                    </div>
                  )}

                  <RoleSelector 
                    onGenerate={handleGenerateRoadmap}
                    isLoading={isRoadmapLoading}
                    resumeSkills={analysisResult?.structuredResume?.skills || []}
                  />
                </div>
              ) : (
                <div className="animate-[fadeIn_0.4s_ease-out] flex flex-col gap-6">
                  
                  {/* Reset action bar */}
                  <div className="flex justify-between items-center mb-2">
                    <button className="bg-transparent border-none text-slate-400 hover:text-slate-100 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors duration-200" onClick={() => setRoadmapResult(null)}>
                      <ArrowLeft size={16} /> Re-configure Roadmap
                    </button>
                  </div>

                  {/* Split Dashboard: Left: Gaps details, Right: Timeline */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
                    <div className="w-full">
                      <SkillRadar 
                        resumeSkills={analysisResult?.structuredResume?.skills || []}
                        requiredGaps={roadmapResult.requiredGaps}
                        preferredGaps={roadmapResult.preferredGaps}
                        targetRole={roadmapResult.targetRole}
                      />
                    </div>
                    
                    <div className="w-full">
                      <RoadmapTimeline roadmapData={roadmapResult.roadmap} />
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
