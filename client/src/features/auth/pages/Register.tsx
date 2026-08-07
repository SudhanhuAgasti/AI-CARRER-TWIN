/**
 * @file Register.tsx
 * @description Candidate registration view with Zod validation.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Sparkles, Brain, Briefcase } from 'lucide-react';
import { registerSchema, type RegisterFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { axiosInstance } from '../../../api/axiosInstance';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

// High-fidelity 3D-looking sci-fi robot SVG component
function SmilingRobot() {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 animate-bounce-slow">
      <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Metallic helmet gradient */}
          <linearGradient id="metal-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="45%" stopColor="#1F2937" />
            <stop offset="90%" stopColor="#111827" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          
          {/* Visor depth gradient */}
          <linearGradient id="visor-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>

          {/* Visor reflection glare */}
          <linearGradient id="visor-glare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Neck Hydraulic Pistons */}
        <rect x="25" y="44" width="14" height="11" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
        <line x1="29" y1="46" x2="29" y2="52" stroke="#9CA3AF" strokeWidth="2.5" />
        <line x1="35" y1="46" x2="35" y2="52" stroke="#9CA3AF" strokeWidth="2.5" />
        
        {/* Collar base connector */}
        <path d="M18 53h28l-3 4H21l-3-4z" fill="#0F172A" stroke="#374151" strokeWidth="1.5" />

        {/* Left & Right Side Bolt Vents (Ears) */}
        <rect x="3" y="23" width="5" height="14" rx="2" fill="url(#metal-base)" stroke="#4B5563" strokeWidth="1.2" />
        <rect x="56" y="23" width="5" height="14" rx="2" fill="url(#metal-base)" stroke="#4B5563" strokeWidth="1.2" />
        <circle cx="5.5" cy="30" r="1.5" fill="#FF3366" className="animate-pulse" />
        <circle cx="58.5" cy="30" r="1.5" fill="#FF3366" className="animate-pulse" />

        {/* Antennas */}
        <path d="M12 14L12 5" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="3.5" r="2.5" fill="#FF3366" className="filter drop-shadow-[0_0_6px_#FF3366]" />
        <path d="M52 14L52 7" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />

        {/* Main Robot Helmet/Head */}
        <rect x="8" y="11" width="48" height="36" rx="9" fill="url(#metal-base)" stroke="#4B5563" strokeWidth="2.5" />
        
        {/* Crown plate line */}
        <path d="M20 11c1 4 8 5 12 5s11-1 12-5" fill="none" stroke="#374151" strokeWidth="2" />

        {/* Visor Area (Sleek Dark Glass) */}
        <rect x="12" y="17" width="40" height="21" rx="5" fill="url(#visor-glass)" stroke="#374151" strokeWidth="1.8" />

        {/* Holographic Visor Reflection (Realistic Glare) */}
        <path d="M13 18h28L28 36H13z" fill="url(#visor-glare)" pointerEvents="none" />

        {/* Realistic Cyber Camera Lenses (Eyes) */}
        {/* Left eye camera lens */}
        <circle cx="21" cy="27" r="5" fill="#030712" stroke="#38BDF8" strokeWidth="1" />
        <circle cx="21" cy="27" r="3.2" fill="#0284C7" />
        <circle cx="21" cy="27" r="1.5" fill="#0EA5E9" />
        <circle cx="20" cy="26" r="0.8" fill="#FFF" /> {/* Reflection dot */}

        {/* Right eye camera lens */}
        <circle cx="43" cy="27" r="5" fill="#030712" stroke="#38BDF8" strokeWidth="1" />
        <circle cx="43" cy="27" r="3.2" fill="#0284C7" />
        <circle cx="43" cy="27" r="1.5" fill="#0EA5E9" />
        <circle cx="42" cy="26" r="0.8" fill="#FFF" />

        {/* Smiling LED Indicator (Mouth) */}
        <path d="M26 33.5c1.5 2 4.5 2 6 0" stroke="#FF3366" strokeWidth="2.5" strokeLinecap="round" className="filter drop-shadow-[0_0_4px_#FF3366]" />

        {/* Vent Grill Lines */}
        <line x1="15" y1="34.5" x2="18" y2="34.5" stroke="#374151" strokeWidth="1.2" />
        <line x1="46" y1="34.5" x2="49" y2="34.5" stroke="#374151" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export function Register() {
  const { addToast } = useUIStore();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const { accessToken, user } = response.data;
      setAuth(accessToken, user);
      
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your account has been set up successfully!',
      });
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-lg px-4 relative z-10 py-6">
      {/* Stylesheet Overrides to clean up parent column spacing and configure animations */}
      <style>{`
        /* Hide parent left column content on desktop to avoid overlap under our fixed panel */
        .grid.min-h-screen > div:first-child > * {
          display: none !important;
        }
        
        .grid.min-h-screen > div:first-child {
          background: #08090D !important;
          border-right: 1px solid rgba(255, 51, 102, 0.12) !important;
        }

        /* Adjust right column background */
        .grid.min-h-screen > div:nth-child(2) {
          background: #050608 !important;
          position: relative;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Coordinated 3D orbit animations for playing cards (Radius: 180px with a 3D perspective tilt) */
        @keyframes orbit-d1 {
          0% { transform: rotate(0deg) translateY(-170px) rotate(0deg) rotateY(15deg) rotateX(10deg); }
          100% { transform: rotate(360deg) translateY(-170px) rotate(-360deg) rotateY(15deg) rotateX(10deg); }
        }
        @keyframes orbit-d2 {
          0% { transform: rotate(120deg) translateY(-170px) rotate(-120deg) rotateY(15deg) rotateX(10deg); }
          100% { transform: rotate(480deg) translateY(-170px) rotate(-480deg) rotateY(15deg) rotateX(10deg); }
        }
        @keyframes orbit-d3 {
          0% { transform: rotate(240deg) translateY(-170px) rotate(-240deg) rotateY(15deg) rotateX(10deg); }
          100% { transform: rotate(600deg) translateY(-170px) rotate(-600deg) rotateY(15deg) rotateX(10deg); }
        }

        /* Mobile orbits for mini cards (Radius: 80px) */
        @keyframes orbit-m1 {
          0% { transform: rotate(0deg) translateY(-80px) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(-80px) rotate(-360deg); }
        }
        @keyframes orbit-m2 {
          0% { transform: rotate(120deg) translateY(-80px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateY(-80px) rotate(-480deg); }
        }
        @keyframes orbit-m3 {
          0% { transform: rotate(240deg) translateY(-80px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateY(-80px) rotate(-600deg); }
        }

        .animate-orbit-d1 { animation: orbit-d1 30s linear infinite; }
        .animate-orbit-d2 { animation: orbit-d2 30s linear infinite; }
        .animate-orbit-d3 { animation: orbit-d3 30s linear infinite; }

        .animate-orbit-m1 { animation: orbit-m1 14s linear infinite; }
        .animate-orbit-m2 { animation: orbit-m2 14s linear infinite; }
        .animate-orbit-m3 { animation: orbit-m3 14s linear infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(2deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes pulse-light {
          0%, 100% { opacity: 0.35; transform: scale(0.96); }
          50% { opacity: 0.65; transform: scale(1.04); }
        }
        .animate-pulse-light {
          animation: pulse-light 5s ease-in-out infinite;
        }
      `}</style>

      {/* Desktop Fixed Left Illustration Panel (5/12 width is 41.666667%) */}
      <div className="fixed left-0 top-0 bottom-0 w-[41.666667vw] z-30 bg-[#08090D] border-r border-primary/12 hidden lg:flex flex-col justify-between p-12 overflow-hidden select-none text-left">
        {/* Glow ambient background layers */}
        <div className="absolute top-[20%] left-[-15%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse-light" />
        <div className="absolute bottom-[10%] right-[-15%] w-[350px] h-[350px] bg-[#E20042]/5 rounded-full blur-[90px] animate-pulse-light" />

        {/* Logo Header */}
        <div className="relative z-10 flex items-center gap-2">
          <svg className="h-6 w-6 text-primary filter drop-shadow-[0_0_8px_var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" className="text-white" />
          </svg>
          <span className="font-extrabold tracking-tight text-xl font-outfit text-white">
            Career<span className="text-primary font-bold">Twin</span>
          </span>
        </div>

        {/* Orbit System */}
        <div className="relative w-full flex items-center justify-center my-auto min-h-[460px] perspective-[1200px]">
          {/* Concentric rotating orbits */}
          <div className="absolute w-[360px] h-[360px] border border-primary/15 border-dashed rounded-full" />
          <div className="absolute w-[240px] h-[240px] border border-primary/10 rounded-full" />
          
          <div className="absolute w-36 h-36 bg-primary/15 rounded-full blur-[25px] animate-pulse-light" />

          {/* Center Smiling Robot Avatar Core */}
          <div className="relative z-10 w-28 h-28 rounded-full bg-[#07090E] border border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,51,102,0.4)]">
            <SmilingRobot />
          </div>

          {/* Premium Desktop Orbiting Cards (3D Playing Card Styles) */}
          
          {/* Playing Card 1: Career Insights (Ace of Sparkles) */}
          <div className="absolute z-20 flex flex-col justify-between p-4 bg-[#0A0D14]/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-[0_10px_35px_rgba(255,51,102,0.2)] hover:border-primary transition-all duration-300 animate-orbit-d1 w-[140px] h-[200px]">
            {/* Top-Left Corner Rank & Suit */}
            <div className="flex flex-col items-center self-start text-xs font-black text-primary font-outfit leading-none">
              <span>A</span>
              <Sparkles className="h-3 w-3 mt-1" />
            </div>

            {/* Central Large Suite Emblem */}
            <div className="flex items-center justify-center my-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(255,51,102,0.4)] text-primary">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            {/* Bottom Info & Rank */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-white tracking-wide text-center leading-tight">Career Insights</span>
              <span className="text-[9px] text-primary/80 font-bold uppercase tracking-wider mt-1">97% Match</span>
            </div>
          </div>

          {/* Playing Card 2: AI Learning (Ace of Brains) */}
          <div className="absolute z-20 flex flex-col justify-between p-4 bg-[#0A0D14]/95 backdrop-blur-md border border-[#9333EA]/35 rounded-2xl shadow-[0_10px_35px_rgba(147,51,234,0.2)] hover:border-[#9333EA] transition-all duration-300 animate-orbit-d2 w-[140px] h-[200px]">
            {/* Top-Left Corner */}
            <div className="flex flex-col items-center self-start text-xs font-black text-[#A855F7] font-outfit leading-none">
              <span>A</span>
              <Brain className="h-3 w-3 mt-1" />
            </div>

            {/* Central Large Emblem */}
            <div className="flex items-center justify-center my-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9333EA]/10 border border-[#9333EA]/30 shadow-[0_0_15px_rgba(147,51,234,0.4)] text-[#A855F7]">
                <Brain className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-white tracking-wide text-center leading-tight">AI Learning</span>
              <span className="text-[9px] text-[#A855F7]/80 font-bold uppercase tracking-wider mt-1">Roadmaps</span>
            </div>
          </div>

          {/* Playing Card 3: Job Matching (Ace of Briefcases) */}
          <div className="absolute z-20 flex flex-col justify-between p-4 bg-[#0A0D14]/95 backdrop-blur-md border border-[#22C55E]/35 rounded-2xl shadow-[0_10px_35px_rgba(34,197,94,0.2)] hover:border-[#22C55E] transition-all duration-300 animate-orbit-d3 w-[140px] h-[200px]">
            {/* Top-Left Corner */}
            <div className="flex flex-col items-center self-start text-xs font-black text-[#4ADE80] font-outfit leading-none">
              <span>A</span>
              <Briefcase className="h-3 w-3 mt-1" />
            </div>

            {/* Central Large Emblem */}
            <div className="flex items-center justify-center my-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 shadow-[0_0_15px_rgba(34,197,94,0.4)] text-[#4ADE80]">
                <Briefcase className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-white tracking-wide text-center leading-tight">Job Matches</span>
              <span className="text-[9px] text-[#4ADE80]/80 font-bold uppercase tracking-wider mt-1">10+ Roles</span>
            </div>
          </div>
        </div>

        {/* Desktop Footer text */}
        <div className="relative z-10 max-w-sm mt-auto">
          <p className="text-sm font-semibold text-white/95 leading-relaxed font-outfit">
            Join millions of professionals transforming their careers with AI.
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Registration Card Container */}
      <div className="relative z-10 w-full bg-[#0C0E14]/80 border border-primary/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(255,51,102,0.12)] backdrop-blur-xl space-y-6">
        
        {/* Mobile-Only Responsive Orbit Banner with Mini Playing Cards */}
        <div className="lg:hidden relative w-full h-[180px] flex items-center justify-center overflow-hidden bg-[#0F111A]/40 rounded-2xl border border-border/40 py-2">
          <div className="absolute w-[140px] h-[140px] border border-primary/20 border-dashed rounded-full" />
          <div className="absolute w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />

          {/* Glowing AI Core Sphere with Smiling Robot */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-[#0D1017] border border-primary/40 flex items-center justify-center shadow-[0_0_20px_hsla(336,100%,60%,0.4)]">
            <SmilingRobot />
          </div>

          {/* Mini Playing Cards Orbiting on Mobile */}
          <div className="absolute z-10 flex flex-col justify-between p-1 bg-[#0A0D14] border border-primary/40 rounded-lg shadow-md w-11 h-16 animate-orbit-m1 text-[8px] font-bold">
            <div className="flex flex-col items-center self-start text-[6px] text-primary leading-none">
              <span>A</span>
              <Sparkles className="h-2 w-2 mt-0.5" />
            </div>
            <span className="text-[6px] text-white text-center leading-none">Insights</span>
          </div>

          <div className="absolute z-10 flex flex-col justify-between p-1 bg-[#0A0D14] border border-[#9333EA]/40 rounded-lg shadow-md w-11 h-16 animate-orbit-m2 text-[8px] font-bold">
            <div className="flex flex-col items-center self-start text-[6px] text-[#A855F7] leading-none">
              <span>A</span>
              <Brain className="h-2 w-2 mt-0.5" />
            </div>
            <span className="text-[6px] text-white text-center leading-none">Learn</span>
          </div>

          <div className="absolute z-10 flex flex-col justify-between p-1 bg-[#0A0D14] border border-[#22C55E]/40 rounded-lg shadow-md w-11 h-16 animate-orbit-m3 text-[8px] font-bold">
            <div className="flex flex-col items-center self-start text-[6px] text-[#4ADE80] leading-none">
              <span>A</span>
              <Briefcase className="h-2 w-2 mt-0.5" />
            </div>
            <span className="text-[6px] text-white text-center leading-none">Jobs</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3.5">
          {/* CareerTwin Logo */}
          <div className="flex items-center gap-2 select-none">
            <svg className="h-6 w-6 text-primary filter drop-shadow-[0_0_8px_var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" className="text-white" />
            </svg>
            <span className="font-extrabold tracking-tight text-xl font-outfit text-white">
              Career<span className="text-primary font-bold">Twin</span>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit">
              Create your account
            </h1>
            <p className="text-xs text-muted-foreground/80 font-medium">
              Start your AI-powered career transformation
            </p>
          </div>
        </div>

        {/* Main Sign Up Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('name')}
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            error={errors.name?.message}
            icon={<User className="h-4 w-4 text-muted-foreground/70" />}
            autoComplete="name"
            className="bg-[#131722]/50 border-border/80 focus:border-primary/80 focus:ring-primary/10 text-white rounded-xl placeholder:text-muted-foreground/45"
          />

          <Input
            {...register('email')}
            label="Email address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            icon={<Mail className="h-4 w-4 text-muted-foreground/70" />}
            autoComplete="email"
            className="bg-[#131722]/50 border-border/80 focus:border-primary/80 focus:ring-primary/10 text-white rounded-xl placeholder:text-muted-foreground/45"
          />

          <Input
            {...register('password')}
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            icon={<Lock className="h-4 w-4 text-muted-foreground/70" />}
            autoComplete="new-password"
            className="bg-[#131722]/50 border-border/80 focus:border-primary/80 focus:ring-primary/10 text-white rounded-xl placeholder:text-muted-foreground/45"
          />

          <Input
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            icon={<Lock className="h-4 w-4 text-muted-foreground/70" />}
            autoComplete="new-password"
            className="bg-[#131722]/50 border-border/80 focus:border-primary/80 focus:ring-primary/10 text-white rounded-xl placeholder:text-muted-foreground/45"
          />

          {/* Terms of Service Checkbox */}
          <div className="flex items-start space-x-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 h-4.5 w-4.5 rounded-md border-border/60 bg-muted/30 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer accent-primary"
              required
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground/80 leading-relaxed select-none cursor-pointer">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline hover:text-primary-foreground font-semibold transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline hover:text-primary-foreground font-semibold transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-6 mt-2 rounded-xl bg-gradient-to-r from-primary to-[#FF3366] hover:from-primary/95 hover:to-[#FF3366]/95 text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform active:scale-[0.99]" 
            isLoading={isSubmitting}
          >
            Create account
          </Button>
        </form>

        {/* Alternative Social Logins */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40"></div>
            </div>
            <span className="relative px-3 bg-[#0C0E14] text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 select-none">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full py-5 rounded-xl flex items-center justify-center gap-2 border-border/40 hover:bg-muted/40 hover:border-primary/30 text-sm font-semibold transition-all duration-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span className="text-white/90">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-5 rounded-xl flex items-center justify-center gap-2 border-border/40 hover:bg-muted/40 hover:border-primary/30 text-sm font-semibold transition-all duration-200"
            >
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-white/90">GitHub</span>
            </Button>
          </div>
        </div>

        {/* Already have an account footer */}
        <p className="text-center text-xs text-muted-foreground/80 font-medium">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-primary hover:underline hover:text-primary-foreground transition-colors ml-1">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
