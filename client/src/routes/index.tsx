/**
 * @file index.tsx
 * @description Main application routing layout maps with protected and public route guards.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Core guards
import ProtectedRoute from '../components/layout/ProtectedRoute';
import PublicRoute from '../components/layout/PublicRoute';
import AuthLayout from '../components/layout/AuthLayout';
import Skeleton from '../components/ui/Skeleton';

// Lazy loading feature pages to optimize performance
const Login = lazy(() => import('../features/auth/pages/Login'));
const Register = lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword = lazy(() => import('../features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../features/auth/pages/ResetPassword'));
const OtpVerification = lazy(() => import('../features/auth/pages/OtpVerification'));
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard'));
const ResumeAnalyzer = lazy(() => import('../features/resume/pages/ResumeAnalyzer'));
const InterviewWorkspace = lazy(() => import('../features/interview/pages/InterviewWorkspace'));
const SkillGapWorkspace = lazy(() => import('../features/skill-gap/pages/SkillGapWorkspace'));
const LinkedinOptimizer = lazy(() => import('../features/linkedin/pages/LinkedinOptimizer'));
const SettingsControl = lazy(() => import('../features/settings/pages/SettingsControl'));

// Lazy page skeletons
function PageLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Guest routes guarded under PublicRoute */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AuthLayout>
                  <Register />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <AuthLayout>
                  <ForgotPassword />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <AuthLayout>
                  <ResetPassword />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <AuthLayout>
                  <OtpVerification />
                </AuthLayout>
              </PublicRoute>
            }
          />

          {/* Secure authenticated user routes under ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <SkillGapWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/linkedin"
            element={
              <ProtectedRoute>
                <LinkedinOptimizer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsControl />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: Redirect root and invalid URLs */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
