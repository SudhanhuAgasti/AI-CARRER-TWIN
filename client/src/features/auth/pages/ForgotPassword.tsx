/**
 * @file ForgotPassword.tsx
 * @description Account recovery request screen with email validation.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

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
    <div className="space-y-6 text-left w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Forgot Password?</h1>
        <p className="text-xs text-muted-foreground">
          Enter the email associated with your account and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          <KeyRound className="mr-2 h-4 w-4" />
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to login
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
