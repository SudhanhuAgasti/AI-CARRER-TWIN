/**
 * @file Register.tsx
 * @description Candidate registration view with Zod validation.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFields } from '../auth.validation';
import { useUIStore } from '../../../store/uiStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export function Register() {
  const { addToast } = useUIStore();

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your account has been set up! Please verify your email.',
      });
      
      // Redirect to OTP verification screen (mocked route change)
      window.location.href = `/verify-otp?email=${encodeURIComponent(data.email)}`;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: 'This email is already registered. Please login or reset password.',
      });
    }
  };

  return (
    <div className="space-y-6 text-left w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
        <p className="text-xs text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('name')}
          label="Full Name"
          type="text"
          placeholder="Sudhanshu Agasti"
          error={errors.name?.message}
          icon={<User className="h-4 w-4" />}
          autoComplete="name"
        />

        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        <Input
          {...register('password')}
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        <Input
          {...register('confirmPassword')}
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default Register;
