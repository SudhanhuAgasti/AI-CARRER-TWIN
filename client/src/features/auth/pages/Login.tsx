/**
 * @file Login.tsx
 * @description Authentication Login screen with premium high-fidelity UI matching the design screenshot.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFields } from '../auth.validation';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { axiosInstance } from '../../../api/axiosInstance';
import Button from '../../../components/ui/Button';

// High-fidelity 3D Glass Crystal SVG (Matching the exact look in the photo)
function GlassCrystal({ className = '', rotation = '0deg', scale = '1' }: { className?: string; rotation?: string; scale?: string }) {
  return (
    <svg
      className={`w-24 h-24 sm:w-32 sm:h-32 filter drop-shadow-[0_0_25px_rgba(255,51,102,0.45)] pointer-events-none select-none transition-all duration-300 ${className}`}
      style={{ transform: `rotate(${rotation}) scale(${scale})` }}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="crystal-face-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3F70" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8A0F2B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="crystal-face-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6688" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2E040B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="crystal-face-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFA3B8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3366" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* 3D Tilted Prism / Crystal Shape */}
      <polygon points="50,10 85,35 60,85 15,60" fill="url(#crystal-face-1)" />
      <polygon points="50,10 85,35 65,45" fill="url(#crystal-face-2)" opacity="0.95" />
      <polygon points="50,10 15,60 30,35" fill="url(#crystal-face-3)" opacity="0.8" />
      <polygon points="15,60 60,85 30,35" fill="#1C050B" opacity="0.6" />
    </svg>
  );
}

export function Login() {
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { accessToken, user } = response.data;
      setAuth(accessToken, user);

      addToast({
        type: 'success',
        title: 'Logged in successfully',
        message: `Welcome back, ${user.name}!`,
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.response?.data?.message || 'Invalid email or password combination. Please try again.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020204]">
      {/* Stylesheet Overrides to clean up parent column spacing and configure animations */}
      <style>{`
        /* Hide parent left column content on desktop to avoid overlap under our fixed panel */
        .grid.min-h-screen > div:first-child {
          display: none !important;
        }
        
        .grid.min-h-screen > div:nth-child(2) {
          grid-column: span 12 / span 12 !important;
          background: #020204 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          position: relative !important;
          overflow: hidden !important;
        }

        /* Float animations for 3D Crystals */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(12deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-8deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 8s ease-in-out infinite;
        }
      `}</style>

      {/* Background large tilted thin red/purple ring/orbit (exact layout as photo) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <svg className="w-[340px] h-[340px] sm:w-[600px] sm:h-[600px] md:w-[750px] md:h-[750px] text-red-500/10 opacity-50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.15" />
        </svg>
      </div>

      {/* Decorative background rings positioned dynamically */}
      <div className="absolute top-[15%] right-[8%] w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] rounded-full border border-red-500/10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[4%] w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] rounded-full border border-red-500/5 pointer-events-none" />
      
      {/* Small floating neon circles and glowing particles */}
      <div className="absolute top-[40%] right-[12%] sm:right-[20%] w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-red-500/10 pointer-events-none" />
      <div className="absolute bottom-[30%] right-[15%] sm:right-[22%] w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-red-500/10 pointer-events-none" />
      <div className="absolute top-[48%] left-[8%] sm:left-[12%] w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-600/40 pointer-events-none" />
      
      {/* 3D Glass Crystals (exactly matching position and angle of the photo across all screen sizes) */}
      {/* Top Left Crystal */}
      <GlassCrystal className="absolute top-[5%] sm:top-[10%] left-[3%] sm:left-[6%] animate-float-slow" rotation="15deg" scale="1.1" />
      {/* Bottom Left Crystal */}
      <GlassCrystal className="absolute bottom-[5%] sm:bottom-[10%] left-[2%] sm:left-[4%] animate-float-medium" rotation="-20deg" scale="0.9" />
      {/* Top Right Crystal */}
      <GlassCrystal className="absolute top-[6%] sm:top-[12%] right-[3%] sm:right-[6%] animate-float-slow" rotation="45deg" scale="0.85" />
      {/* Bottom Right Crystal */}
      <GlassCrystal className="absolute bottom-[8%] sm:bottom-[15%] right-[4%] sm:right-[8%] animate-float-medium" rotation="-10deg" scale="0.75" />

      {/* Main Login Card with exact styling & subtle pink/red outer glow border */}
      <div className="relative z-10 w-full max-w-[375px] sm:max-w-[390px] mx-4 bg-[#090B11]/95 border border-red-500/10 rounded-[20px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(255,51,95,0.06)] backdrop-blur-md">
        
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#FF2E5F] flex items-center justify-center shadow-lg shadow-[#FF2E5F]/20">
            {/* Logo path style (twin silhouettes) */}
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm8 0c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm-8 4v2m8-2v2M8 17h8" />
            </svg>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Career<span className="text-[#FF2E5F]">Twin</span>
          </span>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-[23px] sm:text-[25px] font-bold text-white tracking-tight mb-1">Welcome back</h1>
          <p className="text-xs sm:text-[13px] text-gray-400">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-gray-300">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={`w-full bg-[#121520] border ${
                errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-[#1E2333] focus:border-[#FF2E5F]/60'
              } text-white rounded-xl px-4 py-3 placeholder:text-gray-500 text-sm focus:outline-none transition-all duration-200`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-bold text-[#FF2E5F] hover:text-[#ff4773] transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full bg-[#121520] border ${
                  errors.password ? 'border-red-500/80 focus:border-red-500' : 'border-[#1E2333] focus:border-[#FF2E5F]/60'
                } text-white rounded-xl pl-4 pr-10 py-3 placeholder:text-gray-500 text-sm focus:outline-none transition-all duration-200`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me custom checkbox */}
          <div className="flex items-center space-x-2 pt-1 text-left">
            <label className="relative flex items-center cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => {}}
                className="sr-only"
              />
              <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                rememberMe ? 'border-[#FF2E5F] bg-transparent' : 'border-gray-600 bg-transparent'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-[#FF2E5F] transition-all ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="ml-2.5 text-xs font-semibold text-gray-300">Remember me</span>
            </label>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#FF2E5F] hover:bg-[#E02450] text-white font-bold transition-all duration-200 transform active:scale-[0.99] text-sm tracking-wide mt-2"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1C202E]"></div>
          </div>
          <span className="relative px-3 bg-[#090B11] text-[10px] uppercase font-bold tracking-wider text-gray-500 select-none">
            or continue with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border border-[#1E2333] bg-[#121520] hover:bg-[#181C2A] text-xs font-bold text-white transition-all duration-200"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border border-[#1E2333] bg-[#121520] hover:bg-[#181C2A] text-xs font-bold text-white transition-all duration-200"
          >
            <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs font-semibold text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-[#FF2E5F] hover:text-[#ff4773] transition-colors ml-0.5 font-bold">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;



