/**
 * @file PublicRoute.tsx
 * @description Route guard for public guest-only pages (Login, Register)
  */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { token } = useAuthStore();

  if (token) {
    // If user is already authenticated, redirect to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
