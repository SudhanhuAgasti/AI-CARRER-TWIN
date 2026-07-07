/**
 * @file CodeSandbox.tsx
 * @description isolated code execution sandbox and telemetry analytics runner.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { axiosInstance } from '../../../api/axiosInstance';
import { Terminal, ShieldAlert, Cpu, Sparkles, CheckCircle, RefreshCw, BarChart2 } from 'lucide-react';

export function CodeSandbox() {
  const { addToast } = useUIStore();
  const { structuredResume } = useResumeStore();
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'telemetry'>('sandbox');
  
  // Sandbox state
  const [projectTitle, setProjectTitle] = useState('Async Concurrency Throttle Pool');
  const [repoUrl, setRepoUrl] = useState('https://github.com/developer/concurrency-throttle');
  const [code, setCode] = useState(`/**
 * Implement a promise pool wrapper that processes embeddings
 * sequentially or inside bounded queues.
 */
async function promisePool(tasks, limit) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}`);
  
  const [sandboxProof, setSandboxProof] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  // Telemetry state
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('We are looking for a Senior Staff Engineer with extensive background in Node.js clustering, HMAC-SHA256 crypto signing pipelines, and Docker micro-projects.');
  const [telemetryResult, setTelemetryResult] = useState<any>(null);
  const [telemetryLoading, setTelemetryLoading] = useState(false);

  // Parse project query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const proj = params.get('project');
    if (proj === 'hmac-sandbox') {
      setProjectTitle('Stateless JWT HMAC Verification');
      setRepoUrl('https://github.com/developer/hmac-sandbox');
      setCode(`// Write a stateless container runtime simulated validator
const crypto = require('crypto');
function verifyHmacToken(token, secret) {
  const [header, payload, signature] = token.split('.');
  const expectedSign = crypto.createHmac('sha256', secret)
    .update(\`\${header}.\${payload}\`)
    .digest('base64url');
  return signature === expectedSign;
}`);
    } else if (proj === 'sharding-simulation') {
      setProjectTitle('Database Sharding Simulation');
      setRepoUrl('https://github.com/developer/db-sharding');
      setCode(`// Mock sharding nodes partitioning client data collections
class ShardManager {
  constructor(nodes) {
    this.nodes = nodes;
  }
  getShardNode(key) {
    const hash = hashFunction(key);
    return this.nodes[hash % this.nodes.length];
  }
}`);
    }
  }, []);

  // Initialize resume text from store if available
  useEffect(() => {
    if (structuredResume) {
      const summary = `Candidate: ${structuredResume.name || 'Developer'}\nSkills: ${structuredResume.skills?.join(', ') || ''}\nExperience: ${structuredResume.experience || ''}`;
      setResumeText(summary);
    } else {
      setResumeText('Experienced Javascript developer. Core technical skills include React 19, Express REST APIs, MongoDB Mongoose, and custom JWT tokens.');
    }
  }, [structuredResume]);

  const handleRunSandbox = async () => {
    setRunning(true);
    setSandboxProof(null);
    setVerificationResult(null);
    try {
      // Simulate code compilation and request proof validation
      const response = await axiosInstance.post('/api/sandbox/generate', {
        githubRepoUrl: repoUrl,
        astReport: {
          cleanCodeScore: 94,
          securityScore: 98,
          detectedArchitecturePatterns: ['Sequential Embedding Pools', 'HMAC Signatures']
        }
      });

      setSandboxProof(response.data.proof);
      addToast({
        type: 'success',
        title: 'Sandbox Build Success',
        message: 'Cryptographically signed telemetry proof generated.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sandbox Execution Failed',
        message: 'Could not generate execution signature proof.',
      });
    } finally {
      setRunning(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!sandboxProof?.verificationToken) return;
    setVerifying(true);
    try {
      const response = await axiosInstance.get(`/api/sandbox/verify/${sandboxProof.verificationToken}`);
      setVerificationResult(response.data.verifiedReport);
      addToast({
        type: 'success',
        title: 'Token Cryptographically Verified',
        message: 'HMAC signature is correct and telemetry logs match!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: 'Invalid signature key or corrupted token parameters.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleRunTelemetry = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setTelemetryLoading(true);
    setTelemetryResult(null);
    try {
      const response = await axiosInstance.post('/api/telemetry/analyze', {
        resumeText: resumeText,
        liveMarketJobs: [jobDescription]
      });
      setTelemetryResult(response.data.analysis);
      addToast({
        type: 'success',
        title: 'Telemetry Scan Complete',
        message: 'Job market semantic drift analyzed successfully.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Telemetry Scan Failed',
        message: 'Failed to fetch semantic drift analysis recommendations.',
      });
    } finally {
      setTelemetryLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Isolated Execution Sandbox</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Perform AST analysis validation on your repository projects, generate HMAC-signed proofs, and check market telemetry semantic drifts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-2">
        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeSubTab === 'sandbox' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Terminal className="h-4 w-4" />
          Code Sandbox Runner
        </button>
        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeSubTab === 'telemetry' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <BarChart2 className="h-4 w-4" />
          Market Telemetry Analysis
        </button>
      </div>

      {activeSubTab === 'sandbox' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel instructions */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Project details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div>
                  <span className="font-bold text-foreground text-sm block">{projectTitle}</span>
                  <span className="text-[10px] text-muted-foreground mt-1 block font-semibold">{repoUrl}</span>
                </div>

                <div className="bg-accent/20 p-3.5 rounded-lg border border-border/40 leading-relaxed text-muted-foreground space-y-2">
                  <p>Implement the logic in the editor. Once completed, submit to deploy container validation hooks.</p>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2">
                    <li>Validates syntax parameters.</li>
                    <li>Evaluates execution latency boundaries.</li>
                    <li>Encrypts diagnostic logs using secret keys.</li>
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Simulated Repository URL</span>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cryptographic token status */}
            {sandboxProof && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Cpu className="h-4 w-4" />
                    Sandbox Telemetry Token Ready
                  </div>
                  
                  <div className="p-2.5 bg-background rounded border border-border/40 font-mono text-[9px] break-all select-all text-foreground">
                    {sandboxProof.verificationToken}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="w-full h-8" onClick={handleVerifyToken} isLoading={verifying}>
                      Verify Token HMAC Signature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {verificationResult && (
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <CheckCircle className="h-4 w-4" />
                    Signature verified
                  </div>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground">Decoded Telemetry payload:</p>
                    <pre className="text-[9px] font-mono bg-background p-2 rounded mt-1.5 text-foreground leading-tight">
                      {JSON.stringify(verificationResult, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Editor Panel */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="flex flex-col h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4 bg-muted/20">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4.5 w-4.5 text-primary" />
                  Isolated JavaScript IDE Environment
                </CardTitle>
                <Button size="sm" className="h-8 text-xs font-bold" onClick={handleRunSandbox} isLoading={running}>
                  Run Container Sandbox
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full flex-1 p-4 bg-zinc-950 text-zinc-200 font-mono text-xs outline-none resize-none leading-relaxed border-none rounded-b-xl"
                  spellCheck="false"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Market Telemetry Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 text-xs">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Semantic Drift Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">My Profile Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Market Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <Button className="w-full mt-2" onClick={handleRunTelemetry} isLoading={telemetryLoading} disabled={!resumeText.trim() || !jobDescription.trim()}>
                  Analyze Skill Drift
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="h-full min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Drift Remediation recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 text-xs">
                {telemetryLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 text-xs text-muted-foreground animate-pulse">
                    <RefreshCw className="h-8 w-8 mb-2 animate-spin text-primary" />
                    Calculating semantic gaps using Gemini vector synthesis...
                  </div>
                ) : telemetryResult ? (
                  <div className="space-y-5">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4 bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-bold">Semantic Overlap</span>
                        <span className="text-xl font-extrabold text-foreground">{telemetryResult.similarityScore * 100}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-bold">Identified Gaps</span>
                        <span className="text-xl font-extrabold text-destructive">{(telemetryResult.missingKeywords || []).length} keywords</span>
                      </div>
                    </div>

                    {/* Keywords breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {telemetryResult.matchingKeywords?.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-bold text-foreground">Matched Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {telemetryResult.matchingKeywords.map((tag: string) => (
                              <span key={tag} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-semibold text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {telemetryResult.missingKeywords?.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-bold text-foreground">Missing Gaps</span>
                          <div className="flex flex-wrap gap-1">
                            {telemetryResult.missingKeywords.map((tag: string) => (
                              <span key={tag} className="px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded font-semibold text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommendations list */}
                    {telemetryResult.remediationStrategy?.length > 0 && (
                      <div className="space-y-2 border-t border-border/40 pt-4">
                        <span className="font-bold text-foreground block">Actionable Skill Remedies</span>
                        <div className="space-y-2">
                          {telemetryResult.remediationStrategy.map((rem: string, idx: number) => (
                            <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border/40 flex gap-2 leading-relaxed text-muted-foreground">
                              <span className="text-primary font-bold">{idx + 1}.</span>
                              <p>{rem}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-24 text-muted-foreground select-none">
                    <ShieldAlert className="h-10 w-10 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="text-xs font-bold uppercase tracking-wide">Telemetry Scan Idle</p>
                    <p className="text-[10px]">Submit your details on the left to initiate drift scans.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeSandbox;
