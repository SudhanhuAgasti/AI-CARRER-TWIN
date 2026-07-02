/**
 * @file AuthLayout.tsx
 * @description Authentication split layout component for Login, Register, and recovery screens.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-12 bg-background text-foreground">
      
      {/* Left Column: Visual branding panels (Visible only on desktop screens) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-card p-12 border-r border-border/80 relative overflow-hidden select-none">
        
        {/* Subtle decorative background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/10,transparent_50%)]" />
        
        <div className="relative z-10 flex items-center gap-2">
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            AI Career Twin
          </span>
        </div>

        <div className="relative z-10 space-y-4 text-left">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Accelerate your way to hiring readiness.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            Scan your resumes, build tailored roadmaps, benchmark technical capabilities, and perform simulated AST reviews with your personalized AI Twin.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 text-left">
          &copy; {new Date().getFullYear()} AI Career Twin Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Centered authentication card container */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
