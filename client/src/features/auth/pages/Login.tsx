/**
 * @file Login.tsx
 * @description Authentication Login screen with Zod validation.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginSchema, type LoginFields } from '../auth.validation';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export function Login() {
  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();

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
      // Simulate API sign-in latency
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock user login setup
      setAuth(
        'mock-login-token-jwt',
        'mock-login-refresh-token',
        {
          id: 'dev-user-01',
          name: 'Sudhanshu Agasti',
          email: data.email,
          role: 'Senior Software Engineer',
        }
      );

      addToast({
        type: 'success',
        title: 'Logged in successfully',
        message: `Welcome back, Sudhanshu!`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Invalid email or password combination. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6 text-left w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Sign In</h1>
        <p className="text-xs text-muted-foreground">
          Enter your email below to access your AI Career Twin
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

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            icon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In with Email
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}

export default Login;
