import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
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
  Play,
  Sparkles,
  TrendingUp,
  Terminal,
  Mic,
  GraduationCap,
  Calendar,
  Send,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';

// Inline SVGs to avoid old lucide version exports issues
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.2 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Hook to dynamically remove black/near-black backgrounds from PNG images at runtime
function useTransparentImage(src: string, threshold = 20) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r < threshold && g < threshold && b < threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setProcessedSrc(canvas.toDataURL());
    };
  }, [src, threshold]);

  return processedSrc;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const { resumeId } = useResumeStore();
  
  const [recompiling, setRecompiling] = useState(false);
  const [data, setData] = useState<any>(null);
  const [badgeToken, setBadgeToken] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  const transparentRobotSrc = useTransparentImage('/chatbot_robot_avatar.png', 20);

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
          <div className="relative w-full md:w-96 h-48 flex items-center justify-center shrink-0 select-none">
                      {/* SVG Connecting Neural Paths with Glow Filters & Animated Dots */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 320 180">
              <defs>
                <filter id="neonPinkGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur1" />
                  <feGaussianBlur stdDeviation="6" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="whiteCoreGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(336, 100%, 60%)" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(336, 100%, 60%)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="jarReflect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                </linearGradient>
              </defs>

              {/* Ambient Pulsing Background Stars */}
              <circle cx="85" cy="45" r="0.8" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.1;0.9;0.1" dur="2.5s" repeatCount="indefinite" /></circle>
              <circle cx="105" cy="35" r="1.2" fill="hsl(336, 100%, 75%)" opacity="0.3"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.2s" repeatCount="indefinite" /></circle>
              <circle cx="215" cy="40" r="1" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.1;1;0.1" dur="2.8s" repeatCount="indefinite" /></circle>
              <circle cx="235" cy="50" r="0.8" fill="hsl(336, 100%, 75%)" opacity="0.4"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" /></circle>

              {/* Outer Thick Glowing Neural Pathways (Organic Wavy S-Curves) */}
              <path d="M 160 80 C 120 95, 90 25, 48 36" stroke="hsl(336, 100%, 60%)" strokeWidth="3" fill="none" opacity="0.25" filter="url(#neonPinkGlow)" />
              <path d="M 160 80 C 130 115, 80 65, 32 94" stroke="hsl(336, 100%, 60%)" strokeWidth="3" fill="none" opacity="0.25" filter="url(#neonPinkGlow)" />
              <path d="M 160 80 C 115 65, 100 135, 78 138" stroke="hsl(336, 100%, 60%)" strokeWidth="3" fill="none" opacity="0.25" filter="url(#neonPinkGlow)" />
              <path d="M 160 80 C 200 95, 230 25, 272 36" stroke="hsl(336, 100%, 60%)" strokeWidth="3" fill="none" opacity="0.25" filter="url(#neonPinkGlow)" />
              <path d="M 160 80 C 190 115, 240 65, 288 94" stroke="hsl(336, 100%, 60%)" strokeWidth="3" fill="none" opacity="0.25" filter="url(#neonPinkGlow)" />

              {/* Core Thin White Light Filaments */}
              <path d="M 160 80 C 120 95, 90 25, 48 36" stroke="#fff" strokeWidth="1" fill="none" opacity="0.75" />
              <path d="M 160 80 C 130 115, 80 65, 32 94" stroke="#fff" strokeWidth="1" fill="none" opacity="0.75" />
              <path d="M 160 80 C 115 65, 100 135, 78 138" stroke="#fff" strokeWidth="1" fill="none" opacity="0.75" />
              <path d="M 160 80 C 200 95, 230 25, 272 36" stroke="#fff" strokeWidth="1" fill="none" opacity="0.75" />
              <path d="M 160 80 C 190 115, 240 65, 288 94" stroke="#fff" strokeWidth="1" fill="none" opacity="0.75" />

              {/* Moving Core Fast Sparkles (White) */}
              <circle r="1.5" fill="#fff" filter="url(#whiteCoreGlow)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 160 80 C 120 95, 90 25, 48 36" />
              </circle>
              <circle r="1.5" fill="#fff" filter="url(#whiteCoreGlow)">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M 160 80 C 130 115, 80 65, 32 94" />
              </circle>
              <circle r="1.5" fill="#fff" filter="url(#whiteCoreGlow)">
                <animateMotion dur="2.6s" repeatCount="indefinite" path="M 160 80 C 115 65, 100 135, 78 138" />
              </circle>
              <circle r="1.5" fill="#fff" filter="url(#whiteCoreGlow)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 160 80 C 200 95, 230 25, 272 36" />
              </circle>
              <circle r="1.5" fill="#fff" filter="url(#whiteCoreGlow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 160 80 C 190 115, 240 65, 288 94" />
              </circle>

              {/* Moving Glow Envelopes (Pink, Slower) */}
              <circle r="3.5" fill="hsl(336, 100%, 75%)" opacity="0.7" filter="url(#neonPinkGlow)">
                <animateMotion dur="4.2s" repeatCount="indefinite" path="M 160 80 C 120 95, 90 25, 48 36" />
              </circle>
              <circle r="3.5" fill="hsl(336, 100%, 75%)" opacity="0.7" filter="url(#neonPinkGlow)">
                <animateMotion dur="4.8s" repeatCount="indefinite" path="M 160 80 C 130 115, 80 65, 32 94" />
              </circle>
              <circle r="3.5" fill="hsl(336, 100%, 75%)" opacity="0.7" filter="url(#neonPinkGlow)">
                <animateMotion dur="4.5s" repeatCount="indefinite" path="M 160 80 C 115 65, 100 135, 78 138" />
              </circle>
              <circle r="3.5" fill="hsl(336, 100%, 75%)" opacity="0.7" filter="url(#neonPinkGlow)">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M 160 80 C 200 95, 230 25, 272 36" />
              </circle>
              <circle r="3.5" fill="hsl(336, 100%, 75%)" opacity="0.7" filter="url(#neonPinkGlow)">
                <animateMotion dur="4.4s" repeatCount="indefinite" path="M 160 80 C 190 115, 240 65, 288 94" />
              </circle>

              {/* Pedestal Base Floor */}
              <ellipse cx="160" cy="130" rx="36" ry="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <ellipse cx="160" cy="132" rx="38" ry="12" fill="none" stroke="hsl(336, 100%, 60%)" strokeWidth="2.5" strokeOpacity="0.8" filter="url(#neonPinkGlow)" />
              <ellipse cx="160" cy="132" rx="38" ry="12" fill="url(#pedestalGlow)" opacity="0.35" />

              {/* Glass Dome Overlay */}
              <path d="M 122 130 A 38 48 0 0 1 198 130 Z" fill="url(#jarReflect)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            </svg>

            {/* Glowing Brain image inside the dome */}
            <div className="absolute top-[34px] left-[50%] -translate-x-[50%] w-16 h-16 flex items-center justify-center brain-glow pointer-events-none">
              <img src="/neon_brain_asset.png" alt="Neural Brain" className="w-12 h-12 object-contain rounded-full shadow-[0_0_20px_rgba(236,72,153,0.3)]" />
            </div>

            {/* Floating Glass Icon Cards */}
            
            {/* Top-Left: Document/Resume */}
            <div 
              onClick={() => handleQuickAction('Resume Analysis')}
              className="absolute top-2 left-6 h-9 w-9 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-500 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-float-3d select-none"
            >
              <FileText className="h-4.5 w-4.5" />
            </div>

            {/* Middle-Left: Github */}
            <div 
              onClick={() => handleQuickAction('GitHub Analyzer')}
              className="absolute top-18 left-1 h-9 w-9 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-500 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-float-3d select-none"
              style={{ animationDelay: '-1.5s' }}
            >
              <GithubIcon className="h-4.5 w-4.5" />
            </div>

            {/* Bottom-Left: Linkedin */}
            <div 
              onClick={() => handleQuickAction('LinkedIn Analyzer')}
              className="absolute bottom-2 left-10 h-9 w-9 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-500 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-float-3d select-none"
              style={{ animationDelay: '-0.7s' }}
            >
              <LinkedinIcon className="h-4.5 w-4.5" />
            </div>

            {/* Top-Right: User Profile */}
            <div 
              onClick={() => handleQuickAction('Profile Settings')}
              className="absolute top-2 right-6 h-9 w-9 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-500 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-float-3d select-none"
              style={{ animationDelay: '-2s' }}
            >
              <UserIcon className="h-4.5 w-4.5" />
            </div>

            {/* Middle-Right: Code symbol */}
            <div 
              onClick={() => handleQuickAction('Coding Sandbox')}
              className="absolute top-18 right-1 h-9 w-9 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-500 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-float-3d select-none"
              style={{ animationDelay: '-1s' }}
            >
              <span className="font-extrabold text-[10px] tracking-tighter">{"</>"}</span>
            </div>

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
          { name: 'Resume Score', score: `${data?.breakdown?.resumeScore ?? 92}%`, change: '+8%', icon: FileText, points: 'M 0 15 Q 10 5, 20 12 T 40 8 T 60 18 T 80 5 T 100 12' },
          { name: 'ATS Score', score: `${atsScore}%`, change: '+6%', icon: Briefcase, points: 'M 0 10 Q 15 20, 30 10 T 60 15 T 90 5 T 100 10' },
          { name: 'GitHub Score', score: `${codeSuccess}%`, change: '+7%', icon: GithubIcon, points: 'M 0 20 Q 10 10, 20 18 T 50 8 T 80 15 T 100 5' },
          { name: 'LinkedIn Score', score: `${data?.breakdown?.linkedinScore ?? 83}%`, change: '+5%', icon: LinkedinIcon, points: 'M 0 15 Q 15 5, 30 12 T 60 8 T 90 18 T 100 12' },
          { name: 'Coding Skill', score: `${data?.breakdown?.codingSkill ?? 90}%`, change: '+9%', icon: Terminal, points: 'M 0 12 Q 10 22, 25 10 T 50 15 T 75 5 T 100 8' },
          { name: 'Interview Readiness', score: `${interviewRank}%`, change: '+6%', icon: Mic, points: 'M 0 18 Q 15 10, 30 15 T 60 8 T 90 12 T 100 5' },
          { name: 'Career Readiness', score: `${readinessScore}%`, change: '+8%', icon: TrendingUp, points: 'M 0 15 Q 10 5, 20 12 T 40 8 T 60 18 T 80 5 T 100 12' },
          { name: 'Learning Progress', score: `${data?.breakdown?.learningProgress ?? 68}%`, change: '+12%', icon: GraduationCap, points: 'M 0 22 Q 20 10, 40 18 T 70 8 T 90 12 T 100 5' }
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

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4 py-2 w-full">
                {/* Check list */}
                <div className="w-full sm:flex-1 md:w-full lg:flex-1 space-y-2.5">
                  {[
                    { week: 'Week 1 - Foundations', status: 'Completed', color: 'text-emerald-500' },
                    { week: 'Week 2 - Core Concepts', status: 'Completed', color: 'text-emerald-500' },
                    { week: 'Week 3 - Advanced Topics', status: 'In Progress', color: 'text-pink-500' },
                    { week: 'Week 4 - Expert Level', status: 'Locked', color: 'text-muted-foreground' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs w-full gap-2">
                      <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-[150px] md:max-w-[100px] lg:max-w-[120px]">{step.week}</span>
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
                  { desc: 'GitHub profile analyzed', time: '5h ago', icon: GithubIcon },
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
                <div className="h-8.5 w-8.5 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src="/chatbot_robot_avatar.png" alt="Robot Coach" className="w-full h-full object-cover" />
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
              
              {/* 3D Hologram Pedestal & Robot Standing Showcase */}
              <div className="flex flex-col items-center justify-center py-6 border-b border-white/[0.03] text-center w-full shrink-0 relative overflow-hidden">
                {/* 3D Scene Container */}
                <div className="relative h-36 w-36 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d] select-none pointer-events-none">
                  
                  {/* Holographic light reflection */}
                  <div className="absolute bottom-2 w-24 h-28 bg-gradient-to-t from-pink-500/15 to-transparent opacity-60 rounded-full blur-md" />

                  {/* 3D Hologram Pedestal Floor */}
                  <div className="absolute bottom-0 w-28 h-8 rounded-full bg-pink-500/10 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)] [transform:rotateX(60deg)_translateZ(-5px)] flex items-center justify-center">
                    <div className="w-16 h-4 rounded-full bg-pink-500/20 blur-sm animate-pulse" />
                  </div>

                  {/* Dynamic Shadow on the floor (moves inversely to the robot) */}
                  <div className="absolute bottom-0 w-16 h-4 rounded-full bg-pink-950/60 blur-[3px] [transform:rotateX(60deg)] animate-shadow-scale" />

                  {/* Floating 3D Robot Image with dynamically removed background */}
                  <img 
                    src={transparentRobotSrc} 
                    alt="3D Robot Coach" 
                    className="w-28 h-28 object-contain absolute z-10 animate-float-3d" 
                  />
                </div>
                
                <h3 className="text-sm font-extrabold text-white mt-4">AI Career Coach</h3>
                <div className="flex items-center gap-1.5 mt-1 justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground font-semibold">Online</span>
                </div>
              </div>

              {/* Bot Welcome Bubble */}
              <div className="space-y-1.5 max-w-[90%]">
                <div className="text-[11px] text-muted-foreground mb-1">Hi {user?.name || 'Sudhanshu'}! How can I help you today?</div>
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
