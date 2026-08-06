/**
 * @file Dashboard.tsx
 * @description Main Readiness Dashboard panel displaying score modules, custom SVG sparklines, and Recharts visualizations.
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
import { 
  Award, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Play,
  Sparkles,
  TrendingUp,
  Github,
  Linkedin,
  Terminal,
  Mic,
  GraduationCap,
  Bell,
  Search,
  ChevronRight,
  Lock,
  Calendar,
  Send,
  ArrowRight
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const { resumeId } = useResumeStore();
  
  const [recompiling, setRecompiling] = useState(false);
  const [data, setData] = useState<any>(null);
  const [badgeToken, setBadgeToken] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');

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
        setBadgeToken(response.data.badge.verificationId || response.data.badge.verificationToken);
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

  // Fallback metrics
  const readinessScore = data?.unifiedScore ?? 87;
  const atsScore = data?.breakdown?.atsScore ?? 88;
  const interviewRank = data?.breakdown?.interviewScore ?? 86;
  const codeSuccess = data?.breakdown?.githubScore ?? 85;

  return (
    <div className="space-y-6 text-left pb-10">
      
      {/* Top Banner section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Welcome message & CTA container */}
        <div className="xl:col-span-2 relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/8,transparent_50%)]" />
          
          <div className="space-y-4 relative z-10 max-w-lg">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Welcome back,</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">
              {user?.name || 'Sudhanshu'} 👋
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your AI Career Twin analyzed your profile overnight.<br />
              You improved by <span className="font-bold text-pink-500">+12.4%</span> this week.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => handleQuickAction('Analyze Resume')}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/15 transition-all select-none cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                Analyze Resume
              </button>
              
              <button 
                onClick={() => handleQuickAction('Continue Roadmap')}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold text-white transition-all select-none cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Continue Roadmap
              </button>

              {resumeId && (
                <button 
                  onClick={handleRecompile} 
                  disabled={recompiling}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold text-white transition-all select-none cursor-pointer"
                >
                  Recompile Stats
                </button>
              )}
            </div>
          </div>

          {/* Neural Dome Visualization container */}
          <div className="relative w-full md:w-56 h-44 flex items-center justify-center shrink-0">
            {/* SVG Glowing dome illustration */}
            <svg className="absolute w-52 h-44 overflow-visible" viewBox="0 0 200 170">
              <defs>
                <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(336, 100%, 60%)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(336, 100%, 60%)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                </linearGradient>
              </defs>

              {/* Neural Paths */}
              <path d="M 100 80 Q 60 70, 30 50" stroke="hsl(336, 100%, 60%)" strokeWidth="1" strokeOpacity="0.4" fill="none" className="neural-line" />
              <path d="M 100 80 Q 70 95, 30 110" stroke="hsl(336, 100%, 60%)" strokeWidth="1" strokeOpacity="0.4" fill="none" className="neural-line" />
              <path d="M 100 80 Q 140 70, 170 50" stroke="hsl(336, 100%, 60%)" strokeWidth="1" strokeOpacity="0.4" fill="none" className="neural-line" />
              <path d="M 100 80 Q 130 95, 170 110" stroke="hsl(336, 100%, 60%)" strokeWidth="1" strokeOpacity="0.4" fill="none" className="neural-line" />

              {/* Glowing base plate */}
              <ellipse cx="100" cy="130" rx="42" ry="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <ellipse cx="100" cy="132" rx="45" ry="14" fill="none" stroke="hsl(336, 100%, 60%)" strokeWidth="2.5" strokeOpacity="0.8" />
              <ellipse cx="100" cy="132" rx="45" ry="14" fill="url(#brainGlow)" opacity="0.3" />

              {/* Glass dome */}
              <path d="M 55 130 A 45 60 0 0 1 145 130 Z" fill="url(#domeGrad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            </svg>

            {/* Glowing Brain SVG inside the dome */}
            <div className="absolute top-[35px] left-[50%] -translate-x-[50%] w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50 brain-glow cursor-pointer">
              <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.58 10.49 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-2-7h4v2h-4v-2z" />
              </svg>
            </div>

            {/* Floating neural node badges */}
            <div className="absolute top-6 left-1 flex items-center justify-center h-7 w-7 rounded-lg bg-card border border-white/10 shadow-lg text-pink-500"><FileText className="h-4 w-4" /></div>
            <div className="absolute bottom-10 left-1 flex items-center justify-center h-7 w-7 rounded-lg bg-card border border-white/10 shadow-lg text-pink-500"><Github className="h-4 w-4" /></div>
            <div className="absolute top-6 right-1 flex items-center justify-center h-7 w-7 rounded-lg bg-card border border-white/10 shadow-lg text-pink-500"><User className="h-4 w-4" /></div>
            <div className="absolute bottom-10 right-1 flex items-center justify-center h-7 w-7 rounded-lg bg-card border border-white/10 shadow-lg text-pink-500"><Terminal className="h-4 w-4" /></div>
          </div>
        </div>

        {/* Verification & Quick Credentials */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-wider">
              <Award className="h-4 w-4" />
              Verified Credential
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Generate a cryptographically verified candidate badge for recruiters.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <button 
              onClick={handleVerifyBadge}
              className="w-full py-2.5 px-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-xs font-bold text-pink-500 transition-all select-none cursor-pointer"
            >
              Generate Verified Token
            </button>

            {badgeToken && (
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] text-left">
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">HMAC Token</span>
                <code className="text-[10px] text-pink-400 font-mono break-all select-all block mt-1">{badgeToken}</code>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        
        {/* KPI Cards data matching details */}
        {[
          { name: 'Resume Score', score: '92%', change: '+8%', icon: FileText, points: 'M 0 15 Q 10 5, 20 12 T 40 8 T 60 18 T 80 5 T 100 12' },
          { name: 'ATS Score', score: '88%', change: '+6%', icon: Briefcase, points: 'M 0 10 Q 15 20, 30 10 T 60 15 T 90 5 T 100 10' },
          { name: 'GitHub Score', score: '85%', change: '+7%', icon: Github, points: 'M 0 20 Q 10 10, 20 18 T 50 8 T 80 15 T 100 5' },
          { name: 'LinkedIn Score', score: '83%', change: '+5%', icon: Linkedin, points: 'M 0 15 Q 15 5, 30 12 T 60 8 T 90 18 T 100 12' },
          { name: 'Coding Skill', score: '90%', change: '+9%', icon: Terminal, points: 'M 0 12 Q 10 22, 25 10 T 50 15 T 75 5 T 100 8' },
          { name: 'Interview Readiness', score: '86%', change: '+6%', icon: Mic, points: 'M 0 18 Q 15 10, 30 15 T 60 8 T 90 12 T 100 5' },
          { name: 'Career Readiness', score: '87%', change: '+8%', icon: TrendingUp, points: 'M 0 15 Q 10 5, 20 12 T 40 8 T 60 18 T 80 5 T 100 12' },
          { name: 'Learning Progress', score: '68%', change: '+12%', icon: GraduationCap, points: 'M 0 22 Q 20 10, 40 18 T 70 8 T 90 12 T 100 5' }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={idx} className="bg-card hover:bg-white/[0.02] border border-white/[0.05] p-3 transition-all relative overflow-hidden flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-bold tracking-tight truncate max-w-[80px]">{kpi.name}</span>
                <IconComponent className="h-3.5 w-3.5 text-pink-500" />
              </div>
              
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-white">{kpi.score}</span>
                <span className="text-[9px] font-bold text-emerald-500 flex items-center">
                  ↑ {kpi.change}
                </span>
              </div>

              {/* Sparkline wave at the bottom */}
              <div className="mt-2 h-7 w-full overflow-hidden opacity-60">
                <svg className="w-full h-full" viewBox="0 0 100 25">
                  <path 
                    d={kpi.points} 
                    fill="none" 
                    stroke="hsl(336, 100%, 60%)" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Card>
          );
        })}

      </div>

      {/* Middle row & Sidebar Chat layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left 3 column space */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Charts & AI Insight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Career Growth Chart */}
            <Card className="md:col-span-1 bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white">Career Growth</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Your overall career growth over time</span>
                </div>
                <select className="text-[10px] bg-white/[0.04] border border-white/[0.08] text-white px-2 py-1 rounded-lg focus:outline-none">
                  <option>This Year</option>
                </select>
              </div>
              <ProgressLineChart />
            </Card>

            {/* Skill Radar */}
            <Card className="md:col-span-1 bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="border-b border-white/[0.04] pb-3 mb-2 text-left">
                <span className="text-xs font-extrabold text-white">Skill Radar</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Your skill strength overview</p>
              </div>
              <SkillRadarChart />
            </Card>

            {/* AI Insight */}
            <Card className="md:col-span-1 bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span className="text-xs font-extrabold text-white">AI Insight</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] uppercase tracking-wider text-muted-foreground">Confidence</span>
                  <span className="text-[11px] font-extrabold text-pink-500">96%</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are showing <span className="text-white font-semibold">excellent progress</span>! Focus on System Design and DevOps to increase your interview readiness by <span className="text-pink-500 font-bold">23%</span>.
                </p>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Recommended Actions</span>
                  <div className="space-y-1.5">
                    {[
                      'Improve System Design skills',
                      'Update your GitHub README',
                      'Complete Week 3 of Roadmap',
                      'Practice 2 mock interviews'
                    ].map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer select-none">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 shrink-0" />
                        <span className="truncate">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleQuickAction('AI Insights')}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-extrabold text-pink-500 hover:text-pink-400 border-t border-white/[0.04] pt-3 transition-colors cursor-pointer"
              >
                <span>View All Insights</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Card>

          </div>

          {/* Bottom Grid: Learning Roadmap, Interviews, Activities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Learning Roadmap Progress */}
            <Card className="bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="border-b border-white/[0.04] pb-3 mb-3">
                <span className="text-xs font-extrabold text-white">Learning Roadmap Progress</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Track your learning journey</p>
              </div>

              <div className="flex items-center gap-4 py-2">
                {/* Check list */}
                <div className="flex-1 space-y-2.5">
                  {[
                    { week: 'Week 1 - Foundations', status: 'Completed', color: 'text-emerald-500' },
                    { week: 'Week 2 - Core Concepts', status: 'Completed', color: 'text-emerald-500' },
                    { week: 'Week 3 - Advanced Topics', status: 'In Progress', color: 'text-pink-500' },
                    { week: 'Week 4 - Expert Level', status: 'Locked', color: 'text-muted-foreground' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[120px]">{step.week}</span>
                      <span className={`font-bold text-[10px] shrink-0 ${step.color}`}>{step.status}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Wheel */}
                <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/[0.04]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-pink-500"
                      strokeDasharray="68, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-extrabold text-white">68%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleQuickAction('Learning Roadmap')}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-extrabold text-pink-500 hover:text-pink-400 border-t border-white/[0.04] pt-3 transition-colors cursor-pointer"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="border-b border-white/[0.04] pb-3 mb-3">
                <span className="text-xs font-extrabold text-white">Upcoming Interviews</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">You have 2 upcoming interviews</p>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { company: 'Google', role: 'SDE Intern', date: '24 May, 2024', prep: '85%', logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' },
                  { company: 'Microsoft', role: 'Software Engineer', date: '28 May, 2024', prep: '70%', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' }
                ].map((interview, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <span className="font-extrabold text-[10px] text-pink-500">{interview.company.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-white leading-normal truncate max-w-[80px]">{interview.company}</span>
                        <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">{interview.role}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[9px] text-muted-foreground">{interview.date}</span>
                      <span className="text-[10px] font-bold text-emerald-500 mt-0.5">{interview.prep}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button className="h-6 w-6 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 flex items-center justify-center cursor-pointer transition-colors">
                        <Calendar className="h-3 w-3" />
                      </button>
                      <button className="h-6 w-6 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 flex items-center justify-center cursor-pointer transition-colors">
                        <Mic className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleQuickAction('Upcoming Interviews')}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-extrabold text-pink-500 hover:text-pink-400 border-t border-white/[0.04] pt-3 transition-colors cursor-pointer"
              >
                <span>View All Interviews</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-card border border-white/[0.05] p-5 flex flex-col justify-between">
              <div className="border-b border-white/[0.04] pb-3 mb-3">
                <span className="text-xs font-extrabold text-white">Recent Activities</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Your latest activities</p>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { desc: 'Resume "Resume_v7.pdf" analyzed', time: '2h ago', icon: FileText },
                  { desc: 'GitHub profile analyzed', time: '5h ago', icon: Github },
                  { desc: 'Completed Mock Interview', time: '1d ago', icon: Mic },
                  { desc: 'Week 3 roadmap progress: 60%', time: '1d ago', icon: GraduationCap }
                ].map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-left">
                      <div className="h-6 w-6 rounded-lg bg-white/[0.04] border border-white/[0.06] text-pink-500 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate font-medium">{act.desc}</p>
                        <span className="text-[9px] text-muted-foreground">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => handleQuickAction('Recent Activities')}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-extrabold text-pink-500 hover:text-pink-400 border-t border-white/[0.04] pt-3 transition-colors cursor-pointer"
              >
                <span>View All Activities</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Card>

          </div>

        </div>

        {/* Right side AI Career Coach Chat window */}
        <div className="xl:col-span-1">
          <Card className="h-full bg-card border border-white/[0.05] flex flex-col justify-between overflow-hidden shadow-xl min-h-[500px]">
            {/* Header info */}
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm0 18a8.01 8.01 0 0 1-7-4.14 1 1 0 0 1 .86-1.5c1.47 0 2.82-.57 3.86-1.5a1 1 0 0 1 1.42 1.41c-1.39 1.25-3.23 2.02-5.26 2.08A6 6 0 0 0 18 12.3c0-.07 0-.13-.01-.2a1 1 0 1 1 2 .18 7.97 7.97 0 0 1-7.99 7.72z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-white leading-tight">AI Career Coach</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-muted-foreground font-semibold">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Window area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar text-left flex flex-col justify-start">
              
              {/* Bot Welcome Bubble */}
              <div className="space-y-1.5 max-w-[90%]">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-xs text-white leading-relaxed">
                  Hi {user?.name || 'Sudhanshu'}! How can I help you today?
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 shrink-0">
                {[
                  { text: 'Review my resume', action: 'Resume Optimization' },
                  { text: 'Find job opportunities', action: 'Job Search' },
                  { text: 'Generate roadmap', action: 'Skill Gap Roadmap' },
                  { text: 'Mock interview', action: 'Mock Interviews' },
                  { text: 'Improve GitHub', action: 'GitHub Review' },
                  { text: 'System Design plan', action: 'System Design study guide' }
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuickAction(item.action)}
                    className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-[10px] font-semibold text-muted-foreground hover:text-white text-left transition-all truncate select-none cursor-pointer"
                  >
                    {item.text}
                  </button>
                ))}
              </div>

            </div>

            {/* Footer input form */}
            <div className="p-4 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatMessage.trim()) return;
                  handleQuickAction(`Chat query: "${chatMessage}"`);
                  setChatMessage('');
                }}
                className="flex items-center gap-2 relative"
              >
                <input 
                  type="text" 
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 h-10 pl-3 pr-20 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:border-pink-500/40 text-white transition-all"
                />
                
                <div className="absolute right-2 flex items-center gap-1.5">
                  <button 
                    type="submit"
                    className="h-7.5 w-7.5 rounded-lg bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleQuickAction('Voice Input')}
                    className="h-7.5 w-7.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
