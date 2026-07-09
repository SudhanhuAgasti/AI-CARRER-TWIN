import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { useAuthStore } from '../../../store/authStore';
import { axiosInstance } from '../../../api/axiosInstance';
import { Sparkles, ClipboardCopy } from 'lucide-react';

interface RecruiterOutreachTabProps {
  handleCopy: (text: string) => void;
}

export function RecruiterOutreachTab({ handleCopy }: RecruiterOutreachTabProps) {
  const { addToast } = useUIStore();
  const { structuredResume } = useResumeStore();
  const { user } = useAuthStore();

  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetManagerRole, setTargetManagerRole] = useState('Engineering Manager');
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Form */}
      <div className="lg:col-span-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Outreach Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Output pane */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Recruiter Outreach Recommendations
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
                {result.linkedInInMailBody && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex justify-between items-center border-b border-border/40 pb-1.5 mb-1.5">
                      <span className="font-bold text-foreground">LinkedIn InMail</span>
                      <button onClick={() => handleCopy(`Subject: ${result.linkedInInMailSubject}\n\n${result.linkedInInMailBody}`)} className="p-1 hover:text-primary" title="Copy Subject & Body"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                    </div>
                    {result.linkedInInMailSubject && (
                      <p className="text-foreground font-semibold mb-1">Subject: {result.linkedInInMailSubject}</p>
                    )}
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.linkedInInMailBody}</p>
                  </div>
                )}
                {result.coldEmailBody && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex justify-between items-center border-b border-border/40 pb-1.5 mb-1.5">
                      <span className="font-bold text-foreground">Cold Email Template</span>
                      <button onClick={() => handleCopy(`Subject: ${result.coldEmailSubject}\n\n${result.coldEmailBody}`)} className="p-1 hover:text-primary" title="Copy Subject & Body"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                    </div>
                    {result.coldEmailSubject && (
                      <p className="text-foreground font-semibold mb-1">Subject: {result.coldEmailSubject}</p>
                    )}
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.coldEmailBody}</p>
                  </div>
                )}
                {result.outreachStrategyTips && result.outreachStrategyTips.length > 0 && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <span className="font-bold text-foreground block">Outreach Strategy Tips</span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {result.outreachStrategyTips.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
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
