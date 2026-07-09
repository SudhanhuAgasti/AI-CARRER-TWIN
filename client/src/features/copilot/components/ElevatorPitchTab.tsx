import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { useAuthStore } from '../../../store/authStore';
import { axiosInstance } from '../../../api/axiosInstance';
import { Sparkles, ClipboardCopy } from 'lucide-react';

interface ElevatorPitchTabProps {
  handleCopy: (text: string) => void;
}

export function ElevatorPitchTab({ handleCopy }: ElevatorPitchTabProps) {
  const { addToast } = useUIStore();
  const { structuredResume } = useResumeStore();
  const { user } = useAuthStore();

  const [targetRole, setTargetRole] = useState(user?.role || 'Senior Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('senior');
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Form */}
      <div className="lg:col-span-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Elevator Pitch Parameters</CardTitle>
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
          </CardContent>
        </Card>
      </div>

      {/* Output pane */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Elevator Pitch Recommendations
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
                {(result.pitch30Sec || result['30s']) && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">30-Second Elevator Pitch</span>
                      <button onClick={() => handleCopy(result.pitch30Sec || result['30s'])} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">&quot;{result.pitch30Sec || result['30s']}&quot;</p>
                  </div>
                )}
                {(result.pitch60Sec || result['60s']) && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">60-Second Extended Pitch</span>
                      <button onClick={() => handleCopy(result.pitch60Sec || result['60s'])} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">&quot;{result.pitch60Sec || result['60s']}&quot;</p>
                  </div>
                )}
                {result.pitch2Min && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">2-Minute Comprehensive Pitch</span>
                      <button onClick={() => handleCopy(result.pitch2Min)} className="p-1 hover:text-primary"><ClipboardCopy className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">&quot;{result.pitch2Min}&quot;</p>
                  </div>
                )}
                {result.keyHookStatement && (
                  <div className="space-y-1.5 bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <span className="font-bold text-foreground block">Key Opening Hook</span>
                    <p className="text-muted-foreground leading-relaxed italic">&quot;{result.keyHookStatement}&quot;</p>
                  </div>
                )}
                {result.vocalDeliveryTips && result.vocalDeliveryTips.length > 0 && (
                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <span className="font-bold text-foreground block">Vocal Delivery Tips</span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {result.vocalDeliveryTips.map((tip: string, idx: number) => (
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
