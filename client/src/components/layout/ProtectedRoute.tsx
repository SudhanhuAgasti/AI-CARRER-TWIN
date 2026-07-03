/**
 * @file ProtectedRoute.tsx
 * @description Route guard requiring user authentication to access children.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DashboardLayout from './DashboardLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuthStore();

  if (!token) {
    // Redirect to login page if unauthenticated
    return <Navigate to="/login" replace />;
  }

  // Wrap the protected content inside the master Dashboard Layout
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default ProtectedRoute;
