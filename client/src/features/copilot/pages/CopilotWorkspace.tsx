/**
 * @file CopilotWorkspace.tsx
 * @description Tabbed workspace for Career Copilot suite (Elevator Pitch, Outreach, Negotiation).
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { useAuthStore } from '../../../store/authStore';
import { axiosInstance } from '../../../api/axiosInstance';
import { Sparkles, ClipboardCopy, Volume2, Landmark, Mail } from 'lucide-react';

export function CopilotWorkspace() {
  const { addToast } = useUIStore();
  const { structuredResume } = useResumeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'pitch' | 'outreach' | 'negotiation'>('pitch');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form Fields
  const [targetRole, setTargetRole] = useState(user?.role || 'Senior Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('senior');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetManagerRole, setTargetManagerRole] = useState('Engineering Manager');
  const [location, setLocation] = useState('New York, NY');
  const [baseSalary, setBaseSalary] = useState('150000');
  const [equity, setEquity] = useState('50000');

  const getCandidateData = () => {
    return structuredResume || {
      name: user?.name || 'Candidate',
      email: user?.email || 'candidate@gmail.com',
      skills: ['React', 'NodeJS', 'TypeScript', 'System Design'],
      experience: '5+ years'
    };
  };

  const handleGeneratePitch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axiosInstance.post('/api/copilot/elevator-pitch', {
        resumeData: getCandidateData(),
        targetRole,
        experienceLevel,
      });
      setResult(response.data.elevatorPitch);
      addToast({
        type: 'success',
        title: 'Pitch Generated',
        message: 'Successfully generated your career elevator pitch scripts.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate elevator pitch scripts.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOutreach = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axiosInstance.post('/api/copilot/outreach', {
        candidateData: getCandidateData(),
        targetCompany,
        targetManagerRole,
      });
      setResult(response.data.outreach);
      addToast({
        type: 'success',
        title: 'Outreach Generated',
        message: 'Successfully generated LinkedIn InMail and Email templates.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate outreach templates.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNegotiate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axiosInstance.post('/api/copilot/negotiate', {
        targetRole,
        location,
        currentOffer: {
          baseSalary: Number(baseSalary),
          equity: equity,
          currency: 'USD'
        },
        candidateData: getCandidateData(),
      });
      setResult(response.data.negotiation);
      addToast({
        type: 'success',
        title: 'Strategy Generated',
        message: 'Successfully generated compensation negotiation benchmarks.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate negotiation strategy.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Copied successfully!',
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Workspace Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Career &amp; Negotiation Copilot</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Prepare high-impact elevator pitches, recruiter outreach letters, and custom compensation negotiation plans.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-2">
        <button
          onClick={() => { setActiveTab('pitch'); setResult(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'pitch' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Volume2 className="h-4 w-4" />
          Elevator Pitch
        </button>
        <button
          onClick={() => { setActiveTab('outreach'); setResult(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'outreach' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Mail className="h-4 w-4" />
          Recruiter Outreach
        </button>
        <button
          onClick={() => { setActiveTab('negotiation'); setResult(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'negotiation' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Landmark className="h-4 w-4" />
          Compensation Negotiation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider">Copilot Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {activeTab === 'pitch' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Tech Lead / Staff</option>
                    </select>
                  </div>
                  <Button className="w-full mt-2" onClick={handleGeneratePitch} isLoading={loading}>
                    Generate Spoken Pitch
                  </Button>
                </>
              )}

              {activeTab === 'outreach' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Company</label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Hiring Manager Role</label>
                    <input
                      type="text"
                      value={targetManagerRole}
                      onChange={(e) => setTargetManagerRole(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <Button className="w-full mt-2" onClick={handleGenerateOutreach} isLoading={loading}>
                    Generate Outreach Letters
                  </Button>
                </>
              )}

              {activeTab === 'negotiation' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Job Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Base Salary Offered ($)</label>
                      <input
                        type="number"
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Equity Offered ($)</label>
                      <input
                        type="text"
                        value={equity}
                        onChange={(e) => setEquity(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-2" onClick={handleGenerateNegotiate} isLoading={loading}>
                    Compile Negotiation Plan
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Output and LLM content */}
        <div className="lg:col-span-7">
          <Card className="h-full min-h-[300px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Copilot Output Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-xs text-muted-foreground animate-pulse">
                  <Sparkles className="h-8 w-8 mb-2 animate-spin text-primary" />
                  Generating custom suggestions using Gemini LLM...
                </div>
              ) : result ? (
                <div className="space-y-5 text-xs">
                  {/* Elevator Pitch Result */}
                  {activeTab === 'pitch' && (
                    <div className="space-y-4">
                      {result['30s'] && (
                        <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">30-Second Elevator Pitch</span>
                            <button onClick={() => handleCopy(result['30s'])} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-muted-foreground leading-relaxed italic">&quot;{result['30s']}&quot;</p>
                        </div>
                      )}
                      {result['60s'] && (
                        <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">60-Second Extended Pitch</span>
                            <button onClick={() => handleCopy(result['60s'])} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-muted-foreground leading-relaxed italic">&quot;{result['60s']}&quot;</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Outreach Result */}
                  {activeTab === 'outreach' && (
                    <div className="space-y-4">
                      {result.linkedInInMail && (
                        <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">LinkedIn InMail Template</span>
                            <button onClick={() => handleCopy(result.linkedInInMail)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.linkedInInMail}</p>
                        </div>
                      )}
                      {result.coldEmail && (
                        <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">Cold Email Template</span>
                            <button onClick={() => handleCopy(result.coldEmail)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.coldEmail}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Negotiation Result */}
                  {activeTab === 'negotiation' && (
                    <div className="space-y-4">
                      {result.benchmarks && (
                        <div className="space-y-1.5 bg-emerald-500/5 p-3.5 rounded-lg border border-emerald-500/20">
                          <span className="font-bold text-foreground block">Compensation Benchmarks ({result.benchmarks.percentile || '75th'} Percentile)</span>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase block">Base Range</span>
                              <span className="text-sm font-bold text-foreground">{result.benchmarks.baseSalaryRange}</span>
                            </div>
                            {result.benchmarks.equityRange && (
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block">Equity Range</span>
                                <span className="text-sm font-bold text-foreground">{result.benchmarks.equityRange}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {result.objectionHandlingScripts && (
                        <div className="space-y-2">
                          <span className="font-bold text-foreground block">Objection Objection-Handling Scripts</span>
                          {result.objectionHandlingScripts.map((script: any, idx: number) => (
                            <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border/40 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-foreground">{script.scenario || `Script ${idx+1}`}</span>
                                <button onClick={() => handleCopy(script.script)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                              </div>
                              <p className="text-muted-foreground leading-relaxed italic">&quot;{script.script}&quot;</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground select-none">
                  <p className="text-xs font-bold uppercase tracking-wide">Ready for Synthesis</p>
                  <p className="text-[10px]">Provide parameters on the left and trigger generation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CopilotWorkspace;
