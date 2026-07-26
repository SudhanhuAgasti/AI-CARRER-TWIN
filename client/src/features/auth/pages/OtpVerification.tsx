/**
 * @file OtpVerification.tsx
 * @description OTP (One Time Password) validation interface.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { otpVerificationSchema, type OtpVerificationFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export function OtpVerification() {
  const { addToast } = useUIStore();
  const { setAuth } = useAuthStore();

  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get('email') || 'your email';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpVerificationFields>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (_data: OtpVerificationFields) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Successfully verified. Log user in with mock data
      setAuth(
        'mock-login-token-jwt',
        {
          id: 'dev-user-01',
          name: 'Sudhanshu Agasti',
          email: email,
          role: 'candidate',
        }
      );

      addToast({
        type: 'success',
        title: 'Account Verified',
        message: 'Your email address has been successfully verified.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: 'The OTP code is incorrect or has expired. Please request a new one.',
      });
    }
  };

  const resendOtp = () => {
    addToast({
      type: 'info',
      title: 'OTP Resent',
      message: `A new 6-digit code has been dispatched to ${email}.`,
    });
  };

  return (
    <div className="space-y-6 text-left w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Verify Your Email</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We have sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('code')}
          label="Verification Code (OTP)"
          type="text"
          placeholder="123456"
          maxLength={6}
          error={errors.code?.message}
          icon={<ShieldCheck className="h-4 w-4" />}
          className="text-center tracking-widest text-lg font-bold"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Verify Account
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs font-semibold">
        <a
          href="/login"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </a>

        <button
          onClick={resendOtp}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Resend Code
        </button>
      </div>
    </div>
  );
}

export default OtpVerification;
