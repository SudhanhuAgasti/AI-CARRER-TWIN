import React, { useState } from 'react';
import { ShieldCheck, CalendarRange, Eye, Edit3, ArrowLeft } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader/ResumeUploader';
import AtsScorer from './components/AtsScorer/AtsScorer';
import MatchCard from './components/MatchCard/MatchCard';
import ResumeEditor from './components/ResumeEditor/ResumeEditor';

// Import Global Styles
import './styles/global.css';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'roadmap'
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [rawText, setRawText] = useState('');

  const API_BASE_URL = 'http://localhost:4000/api';

  // Triggers Phase 1 Analysis API
  const handleAnalyzeResume = async (file, jobDescription) => {
    setIsLoading(true);
    setAnalysisResult(null);
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
      alert(`Error analyzing resume: ${error.message}`);
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

      <div className="app-container">
        {/* Header Branding */}
        <header className="app-header">
          <div className="brand-logo-wrapper">
            <div className="logo-glow-ring">
              <span className="logo-dot"></span>
            </div>
            <h1>AI Career Twin</h1>
          </div>
          <p className="brand-tagline">Evaluate, optimize, and map your career trajectory with deterministic AI diagnostics.</p>

          {/* Navigation Tabs */}
          <nav className="tab-navigation">
            <button 
              className={`nav-tab-btn ${activeTab === 'resume' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('resume')}
            >
              <ShieldCheck className="tab-icon" />
              <span>ATS Resume Scorer</span>
            </button>
            <button 
              className={`nav-tab-btn ${activeTab === 'roadmap' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
              disabled={true} /* Disabled initially until Phase 2 integration */
              title="Phase 2 integration coming soon"
            >
              <CalendarRange className="tab-icon" />
              <span>Roadmap Planner (Phase 2)</span>
            </button>
          </nav>
        </header>

        {/* Content body */}
        <main className="app-main-content">
          {activeTab === 'resume' && (
            <div className="tab-content-wrapper">
              
              {!analysisResult ? (
                <div className="uploader-centering-wrapper">
                  <div className="uploader-intro-text">
                    <h2>Optimize Your Resume for ATS Parsers</h2>
                    <p>Upload your file to extract structured fields and compute deterministic scoring benchmarks.</p>
                  </div>
                  <ResumeUploader onAnalyze={handleAnalyzeResume} isLoading={isLoading} />
                </div>
              ) : (
                <div className="analysis-workspace-fade-in">
                  
                  {/* Results Sub-header Navigation */}
                  <div className="workspace-action-bar">
                    <button className="back-upload-btn" onClick={() => setAnalysisResult(null)}>
                      <ArrowLeft size={16} /> Back to Upload
                    </button>

                    <div className="editor-toggle-row">
                      <button 
                        className={`toggle-view-btn ${!editMode ? 'toggle-active' : ''}`}
                        onClick={() => setEditMode(false)}
                      >
                        <Eye size={14} /> Scorecard
                      </button>
                      <button 
                        className={`toggle-view-btn ${editMode ? 'toggle-active' : ''}`}
                        onClick={() => setEditMode(true)}
                      >
                        <Edit3 size={14} /> Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Switch View (Scorecard vs Editor Workspace) */}
                  {!editMode ? (
                    <div className="scorecard-grid-layout">
                      <div className="scorer-column">
                        <AtsScorer atsData={analysisResult.ats} />
                      </div>
                      <div className="match-column">
                        {analysisResult.match ? (
                          <MatchCard 
                            matchData={analysisResult.match} 
                            keywordOverlap={analysisResult.ats.keywordOverlap} 
                          />
                        ) : (
                          <div className="no-jd-card">
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
