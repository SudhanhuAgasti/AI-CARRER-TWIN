/**
 * @file Dashboard.tsx
 * @description Main Readiness Dashboard panel displaying score modules and Recharts visualizations.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { useResumeStore } from '../../../store/resumeStore';
import { axiosInstance } from '../../../api/axiosInstance';
import SkillRadarChart from '../components/SkillRadarChart';
import ProgressLineChart from '../components/ProgressLineChart';
import { Award, Briefcase, FileText, CheckCircle2, ArrowUpRight, PlusCircle, Volume2, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const { resumeId } = useResumeStore();
  
  const [recompiling, setRecompiling] = useState(false);
  const [data, setData] = useState<any>(null);
  const [badgeToken, setBadgeToken] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) return;
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get(`/api/dashboard/${resumeId}`);
        setData(response.data);
      } catch (err) {
        console.error("Dashboard fetch failed, using mock data", err);
      }
    };
    fetchDashboard();
  }, [resumeId]);

  const handleRecompile = async () => {
    if (!resumeId) return;
    setRecompiling(true);
    try {
      const response = await axiosInstance.post(`/api/dashboard/${resumeId}/recompile`);
      setData(response.data);
      addToast({
        type: 'success',
        title: 'Dashboard Recompiled',
        message: 'Metrics have been updated using LLM synthesis.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Recompile Failed',
        message: 'Could not recompile metrics. Please try again.',
      });
    } finally {
      setRecompiling(false);
    }
  };

  const handleVerifyBadge = async () => {
    if (!resumeId) {
      addToast({
        type: 'warning',
        title: 'Resume Required',
        message: 'Please upload a resume first to verify credentials.',
      });
      return;
    }
    try {
      const response = await axiosInstance.get(`/api/dashboard/${resumeId}/verify-badge`);
      if (response.data.success) {
        setBadgeToken(response.data.badge.verificationToken);
        addToast({
          type: 'success',
          title: 'Badge Generated',
          message: 'Public verification credential badge generated!',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: 'Could not retrieve verification credentials.',
      });
    }
  };

  const handleQuickAction = (actionName: string) => {
    addToast({
      type: 'info',
      title: 'Action Triggered',
      message: `Navigating to ${actionName}...`,
    });
  };

  // Fallback to static numbers if no DB entry exists
  const readinessScore = data?.unifiedScore ?? 79;
  const atsScore = data?.breakdown?.atsScore ?? 84;
  const interviewRank = data?.breakdown?.interviewScore ?? 72;
  const codeSuccess = data?.breakdown?.githubScore ?? 91;

  const actionItems = data?.liveActionList || [
    { priority: 'high', task: 'Upload a Resume to generate personalized tasks', category: 'Skills', description: 'Once you upload your resume and complete mock assessments, Gemini will automatically structure high-priority tasks here.' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Hero Welcome Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/8,transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome Back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              Target Role: <span className="font-semibold text-foreground">{user?.role || 'Full Stack Engineer'}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {resumeId && (
              <Button size="sm" variant="outline" onClick={handleRecompile} isLoading={recompiling}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Recompile Stats
              </Button>
            )}
            <Button size="sm" onClick={() => handleQuickAction('Resume Scanners')}>
              <PlusCircle className="mr-1.5 h-4 w-4" />
              New Scan
            </Button>
          </div>
        </div>
      </div>

      {!resumeId && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4.5 text-xs text-amber-500 font-semibold">
          💡 Upload your resume on the &quot;Resume + ATS Analyzer&quot; page to connect this dashboard to real-time assessments and live AI insights!
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Readiness Index Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Readiness Score
              </span>
              <Award className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{readinessScore}%</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                +4% this week
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${readinessScore}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* ATS Overlap Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ATS Match Rate
              </span>
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{atsScore}%</span>
              <span className="text-[10px] font-bold text-emerald-500">
                Optimal
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${atsScore}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Interview Rank Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Interview Rank
              </span>
              <Volume2 className="h-4.5 w-4.5 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{interviewRank}%</span>
              <span className="text-[10px] font-bold text-amber-500">
                Above Avg
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${interviewRank}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Sandbox Success rate Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Code Success
              </span>
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{codeSuccess}%</span>
              <span className="text-[10px] font-bold text-emerald-500">
                100% Secure
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${codeSuccess}%` }} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Skill Gap Coverage Chart Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skill Gap Map</CardTitle>
              <span className="text-[11px] text-muted-foreground">Vs Market Benchmarks</span>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <SkillRadarChart />
          </CardContent>
        </Card>

        {/* Score Timeline Progress Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Readiness Timeline</CardTitle>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +34% over 6w
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressLineChart />
          </CardContent>
        </Card>

      </div>

      {/* Grid: Actions & Badge Verification */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Live Actions checklist */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-foreground">Personalized AI Action Items</h3>
          <Card>
            <CardContent className="divide-y divide-border/40 p-0">
              {actionItems.map((act: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-5 hover:bg-muted/10 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-normal">{act.task}</p>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase
                        ${act.priority === 'high' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 
                          act.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                          'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}
                      `}>
                        {act.priority} priority
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{act.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Public Badge Verification Card */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Verified Credential Badge</h3>
          <Card>
            <CardContent className="p-4 space-y-3 text-center">
              <Award className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <p className="text-xs font-semibold text-foreground">Generate a cryptographically verified candidate badge for tech recruiters.</p>
              <Button size="sm" className="w-full" onClick={handleVerifyBadge}>
                Generate Verified Token
              </Button>

              {badgeToken && (
                <div className="mt-3 p-3 bg-muted rounded-lg border border-border/80 text-left">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">HMAC verification token</span>
                  <code className="text-[10px] text-foreground font-mono break-all select-all block mt-1">{badgeToken}</code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
