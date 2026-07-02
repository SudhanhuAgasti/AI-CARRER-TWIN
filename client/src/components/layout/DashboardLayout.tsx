/**
 * @file DashboardLayout.tsx
 * @description Master layout wrapper for authenticated user dashboard pages.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Left Side Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 animate-in fade-in duration-200">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
