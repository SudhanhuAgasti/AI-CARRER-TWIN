/**
 * @file ForgotPassword.tsx
 * @description Account recovery request screen with high-fidelity split-pane card matching the design screenshot. */

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
      <div className="absolute w-44 h-44 rounded-full bg-[#FF2E5F]/15 blur-3xl filter pointer-events-none" />

      {/* Sparkling particle animations (Matching the 2 circles above the envelope) */}
      <div className="absolute inset-0 pointer-events-none">
        <style>{`
          @keyframes spark-drift-1 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
            50% { transform: translateY(-6px) translateX(3px); opacity: 0.9; }
          }
          @keyframes spark-drift-2 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
            50% { transform: translateY(-8px) translateX(-2px); opacity: 0.8; }
          }
          .spark-pink {
            animation: spark-drift-1 4s ease-in-out infinite;
            transform-origin: center;
          }
          .spark-white {
            animation: spark-drift-2 5s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>
        
        {/* Exact circular particles from the photo */}
        {/* Pink dot above envelope */}
        <div className="absolute top-[18%] left-[58%] w-3 h-3 bg-[#FF2E5F] rounded-full filter drop-shadow-[0_0_6px_#FF2E5F] spark-pink" />
        {/* Grey/White dot slightly lower and to the left */}
        <div className="absolute top-[22%] left-[48%] w-2 h-2 bg-white/50 rounded-full spark-white" />
      </div>

      {/* Main SVG Envelope */}
      <svg
        className="w-44 h-44 filter drop-shadow-[0_0_20px_rgba(255,46,95,0.4)]"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FF2E5F" />
            <stop offset="100%" stopColor="#FF2E5F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Envelope back panel (Rounded rectangle, dark filled body) */}
        <rect x="15" y="25" width="90" height="58" rx="8" fill="#11131E" />

        {/* Crossing fold lines forming a perfect "X" */}
        <line x1="15" y1="25" x2="105" y2="83" stroke="#FF2E5F" strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="25" x2="15" y2="83" stroke="#FF2E5F" strokeWidth="2" strokeLinecap="round" />

        {/* Outer border outline (Rounded rectangle) */}
        <rect x="15" y="25" width="90" height="58" rx="8" stroke="#FF2E5F" strokeWidth="2.2" fill="none" />

        {/* Horizontal bottom base line extending slightly past edges */}
        <line x1="12" y1="83" x2="108" y2="83" stroke="#FF2E5F" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bright Glowing seal at the exact center intersection */}
        <circle cx="60" cy="54" r="15" fill="url(#center-glow)" opacity="0.85" className="animate-pulse" />
        <circle cx="60" cy="54" r="3" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 3px #FFFFFF)' }} />
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#020204] text-white p-4 relative font-sans">

      {/* Top Left Header Section Title (Matches "3. Forgot Password" exactly) */}
      <div className="absolute top-6 left-6 text-sm font-semibold text-gray-400 select-none">
      </div>

      {/* Main split-pane container card */}
      <div className="w-full max-w-[760px] grid grid-cols-1 md:grid-cols-2 bg-[#090B11] border border-white/5 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">

        {/* Left Side: Form Container (50% width on Desktop) */}
        <div className="col-span-1 p-8 sm:p-12 flex flex-col justify-between bg-[#090B11]">
          <div>
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
              <h2 className="text-xl font-bold text-white tracking-tight">Reset your password</h2>
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
                  className={`w-full bg-[#121520] border ${errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-[#1E2333] focus:border-[#FF2E5F]/60'
                    } text-white rounded-xl px-4 py-3 placeholder:text-gray-500 text-sm focus:outline-none transition-all duration-200`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF2E5F] hover:bg-[#E02450] text-white font-bold transition-all duration-200 transform active:scale-[0.99] text-xs tracking-wide shadow-lg shadow-[#FF2E5F]/15"
                isLoading={isSubmitting}
              >
                Send reset link
              </Button>
            </form>
          </div>

          {/* Footer Back Link */}
          <div className="mt-12 text-center md:text-left">
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

