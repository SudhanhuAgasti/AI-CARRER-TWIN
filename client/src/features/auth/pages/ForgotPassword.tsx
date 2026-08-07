/**
 * @file ForgotPassword.tsx
 * @description Account recovery request screen with high-fidelity split-pane card matching the design screenshot.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import Button from '../../../components/ui/Button';

// 3D Glowing Red Envelope SVG
function GlowingEnvelope() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 select-none">
      {/* Red Glowing aura behind the envelope */}
      <div className="absolute w-36 h-36 rounded-full bg-[#FF2E5F]/20 blur-2xl filter pointer-events-none" />

      {/* Sparkling particle animations */}
      <div className="absolute inset-0 pointer-events-none">
        <style>{`
          @keyframes spark-float {
            0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
            50% { transform: translateY(-15px) scale(1.2); opacity: 1; filter: drop-shadow(0 0 6px #FF2E5F); }
          }
          .spark-1 { animation: spark-float 3s ease-in-out infinite; }
          .spark-2 { animation: spark-float 4s ease-in-out infinite 1s; }
          .spark-3 { animation: spark-float 3.5s ease-in-out infinite 2s; }
        `}</style>
        {/* Floating Sparks */}
        <div className="absolute top-[10%] left-[45%] w-1.5 h-1.5 bg-[#FF2E5F] rounded-full spark-1" />
        <div className="absolute top-[25%] left-[28%] w-2 h-2 bg-[#FF7E9F] rounded-full spark-2" />
        <div className="absolute top-[15%] right-[32%] w-1 h-1 bg-[#FF2E5F] rounded-full spark-3" />
        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 bg-white rounded-full spark-1" />
      </div>

      {/* Main SVG Envelope */}
      <svg
        className="w-40 h-40 filter drop-shadow-[0_0_20px_rgba(255,46,95,0.4)]"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="env-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#30040E" />
            <stop offset="100%" stopColor="#120105" />
          </linearGradient>
          <linearGradient id="env-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3366" />
            <stop offset="100%" stopColor="#800D27" />
          </linearGradient>
          <linearGradient id="env-glow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF2E5F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF2E5F" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Envelope back panel */}
        <rect x="15" y="35" width="90" height="55" rx="10" fill="url(#env-body)" stroke="#FF2E5F" strokeWidth="1.5" opacity="0.8" />

        {/* Glowing interior pulse shape */}
        <path d="M15 45L60 70L105 45V80H15V45Z" fill="url(#env-glow)" opacity="0.35" />

        {/* Envelope open flap border and inner folds */}
        <path d="M15 35L60 65L105 35" stroke="#FF2E5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Side folds */}
        <path d="M15 90L50 62" stroke="#FF2E5F" strokeWidth="1.5" opacity="0.7" />
        <path d="M105 90L70 62" stroke="#FF2E5F" strokeWidth="1.5" opacity="0.7" />

        {/* Bottom fold overlay */}
        <path d="M15 90L60 60L105 90Z" fill="url(#env-body)" stroke="#FF2E5F" strokeWidth="1.5" />
        
        {/* Glowing center indicator (heart-like seal) */}
        <circle cx="60" cy="62" r="3.5" fill="#FF2E5F" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px #FF2E5F)' }} />
      </svg>
    </div>
  );
}

export function ForgotPassword() {
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    try {
      // Simulate API request dispatch
      await new Promise((resolve) => setTimeout(resolve, 1200));

      addToast({
        type: 'success',
        title: 'Recovery Email Sent',
        message: `A password reset link has been dispatched to ${data.email}.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error requesting recovery link',
        message: 'Something went wrong. Please check your email and try again.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#000000] text-white p-4 relative font-sans">
      
      {/* Top Left Header Section Title (Matches "3. Forgot Password" exactly) */}
      <div className="absolute top-6 left-6 text-[18px] font-bold text-white/90 select-none">
        3. Forgot Password
      </div>

      {/* Main split-pane container card */}
      <div className="w-full max-w-[760px] grid grid-cols-1 md:grid-cols-2 bg-[#090B11] border border-white/5 rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Left Side: Form Container (50% width on Desktop) */}
        <div className="col-span-1 p-8 sm:p-12 flex flex-col justify-between bg-[#090B11]">
          <div className="flex-1 flex flex-col justify-center">
            {/* Brand logo */}
            <div className="flex items-center gap-2 mb-10 select-none">
              <div className="w-7 h-7 rounded-lg bg-[#FF2E5F] flex items-center justify-center shadow-lg shadow-[#FF2E5F]/20">
                <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm8 0c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm-8 4v2m8-2v2M8 17h8" />
                </svg>
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                Career<span className="text-[#FF2E5F]">Twin</span>
              </span>
            </div>

            {/* Title / Subtitle */}
            <div className="space-y-1 text-left mb-8">
              <h2 className="text-[22px] font-bold text-white tracking-tight">Reset your password</h2>
              <p className="text-xs text-gray-400">
                Enter your email and we'll send you a reset
              </p>
            </div>

            {/* Recovery Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-gray-300">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full bg-[#12141F] border ${
                    errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-[#1E2333] focus:border-[#FF2E5F]/60'
                  } text-white rounded-xl px-4 py-3 placeholder:text-gray-500 text-sm focus:outline-none transition-all duration-200`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FF2E5F] hover:bg-[#E02450] text-white font-bold transition-all duration-200 transform active:scale-[0.99] text-xs tracking-wide shadow-lg shadow-[#FF2E5F]/15"
                isLoading={isSubmitting}
              >
                Send reset link
              </Button>
            </form>
          </div>

          {/* Footer Back Link (Centered) */}
          <div className="mt-8 text-center w-full">
            <a
              href="/login"
              className="text-xs font-bold text-[#FF2E5F] hover:text-[#ff4773] transition-colors"
            >
              Back to sign in
            </a>
          </div>
        </div>

        {/* Right Side: Graphic Visual illustration (50% width on Desktop, hidden on mobile) */}
        <div className="hidden md:flex col-span-1 flex-col justify-center items-center p-8 bg-[#050609] border-l border-white/5 text-center">
          <GlowingEnvelope />
          <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed mt-4">
            We'll send you a secure link to reset your password
          </p>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;

