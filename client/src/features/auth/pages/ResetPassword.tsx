/**
 * @file ResetPassword.tsx
 * @description Recovery password reset input screen.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Save } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export function ResetPassword() {
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (_data: ResetPasswordFields) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your new password has been saved. Please log in.',
      });

      // Redirect to login screen
      window.location.href = '/login';
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Reset Password',
        message: 'The reset link might have expired. Please request a new link.',
      });
    }
  };

  return (
    <div className="space-y-6 text-left w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Reset Password</h1>
        <p className="text-xs text-muted-foreground">
          Enter and confirm your new secure password below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('password')}
          label="New Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        <Input
          {...register('confirmPassword')}
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
