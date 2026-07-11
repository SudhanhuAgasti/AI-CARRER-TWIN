/**
 * @file DashboardLayout.tsx
 * @description Master layout wrapper for authenticated user dashboard pages */

import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { gsap } from 'gsap';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Smooth fade up animation on page transition/route mount
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power4.out', clearProps: 'all' }
      );
    }
  }, [children]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Left Side Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div ref={contentRef} className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
