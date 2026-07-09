import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { useAuthStore } from '../../../store/authStore';
import { axiosInstance } from '../../../api/axiosInstance';
import { Sparkles, ClipboardCopy } from 'lucide-react';

interface CompensationNegotiationTabProps {
  handleCopy: (text: string) => void;
}

export function CompensationNegotiationTab({ handleCopy }: CompensationNegotiationTabProps) {
  const { addToast } = useUIStore();
  const { structuredResume } = useResumeStore();
  const { user } = useAuthStore();

  const [targetRole, setTargetRole] = useState(user?.role || 'Senior Software Engineer');
  const [location, setLocation] = useState('New York, NY');
  const [baseSalary, setBaseSalary] = useState('150000');
  const [equity, setEquity] = useState('50000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const getCandidateData = () => {
    return structuredResume || {
      name: user?.name || 'Candidate',
      email: user?.email || 'candidate@gmail.com',
      skills: ['React', 'NodeJS', 'TypeScript', 'System Design'],
      experience: '5+ years'
    };
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Form */}
      <div className="lg:col-span-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Negotiation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Output pane */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Compensation Negotiation Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-xs text-muted-foreground animate-pulse">
                <Sparkles className="h-8 w-8 mb-2 animate-spin text-primary" />
                Generating custom suggestions using Gemini LLM...
              </div>
            ) : result ? (
              <div className="space-y-4 text-xs">
                {result.benchmarks && (
                  <div className="space-y-1.5 bg-emerald-500/5 p-3.5 rounded-lg border border-emerald-500/20">
                    <span className="font-bold text-foreground block">Compensation Benchmarks ({result.benchmarks.currency || 'USD'})</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 border-b border-border/40 pb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">25th Percentile</span>
                        <span className="text-xs font-bold text-foreground">{result.benchmarks.percentile25?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">50th (Median)</span>
                        <span className="text-xs font-bold text-foreground">{result.benchmarks.percentile50?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">75th Percentile</span>
                        <span className="text-xs font-bold text-foreground">{result.benchmarks.percentile75?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">90th Percentile</span>
                        <span className="text-xs font-bold text-foreground">{result.benchmarks.percentile90?.toLocaleString()}</span>
                      </div>
                    </div>
                    {result.benchmarks.breakdownText && (
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{result.benchmarks.breakdownText}</p>
                    )}
                  </div>
                )}

                {result.negotiationStrategyBlueprint && result.negotiationStrategyBlueprint.length > 0 && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <span className="font-bold text-foreground block">Strategic Steps Blueprint</span>
                    <ul className="list-decimal pl-4 space-y-1 text-muted-foreground">
                      {result.negotiationStrategyBlueprint.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.counterOfferEmails && (
                  <div className="space-y-4">
                    {result.counterOfferEmails.politeIncreaseEmail && (
                      <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                        <div className="flex justify-between items-center border-b border-border/40 pb-1.5 mb-1.5">
                          <span className="font-bold text-foreground">Counter Offer Email (Polite Request)</span>
                          <button onClick={() => handleCopy(result.counterOfferEmails.politeIncreaseEmail)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.counterOfferEmails.politeIncreaseEmail}</p>
                      </div>
                    )}
                    {result.counterOfferEmails.competingOfferEmail && (
                      <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                        <div className="flex justify-between items-center border-b border-border/40 pb-1.5 mb-1.5">
                          <span className="font-bold text-foreground">Counter Offer Email (Using Competing Offer)</span>
                          <button onClick={() => handleCopy(result.counterOfferEmails.competingOfferEmail)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.counterOfferEmails.competingOfferEmail}</p>
                      </div>
                    )}
                  </div>
                )}

                {result.negotiationScripts && result.negotiationScripts.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-foreground block">Objection Objection-Handling Scripts</span>
                    {result.negotiationScripts.map((script: any, idx: number) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border/40 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">{script.scenario || `Script ${idx+1}`}</span>
                          <button onClick={() => handleCopy(script.spokenResponse)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic">&quot;{script.spokenResponse}&quot;</p>
                      </div>
                    ))}
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
  );
}
