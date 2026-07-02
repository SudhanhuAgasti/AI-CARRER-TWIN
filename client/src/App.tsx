import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Skeleton from './components/ui/Skeleton';
import DashboardLayout from './components/layout/DashboardLayout';
import ToastContainer from './components/common/ToastContainer';
import { useUIStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';
import { Sparkles, Terminal, Shield } from 'lucide-react';

function App() {
  const { addToast, theme, setTheme } = useUIStore();
  const { setAuth, user } = useAuthStore();

  // Initialize a mock user session for showcase purposes if none exists
  useEffect(() => {
    if (!user) {
      setAuth(
        'mock-session-jwt-token',
        'mock-session-refresh-token',
        {
          id: 'dev-user-01',
          name: 'Sudhanshu Agasti',
          email: 'sudhanshu@career-twin.ai',
          role: 'Senior Software Engineer',
        }
      );
    }
    // Set theme HTML hook on start
    setTheme(theme);
  }, [user, setAuth, setTheme, theme]);

  const triggerTestSuccessToast = () => {
    addToast({
      type: 'success',
      title: 'Action Completed Successfully',
      message: 'Your resume analysis has been finalized with an ATS score of 92%.',
    });
  };

  const triggerTestWarningToast = () => {
    addToast({
      type: 'warning',
      title: 'API Limit Approaching',
      message: 'You have used 8 out of 10 free mock interview queries today.',
    });
  };

  return (
    <DashboardLayout>
      {/* Toast Alert overlay */}
      <ToastContainer />

      <div className="space-y-8 text-left">
        
        {/* Header Hero banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/8,transparent_50%)]" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Design System & Component Showcase
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Phase 2 is fully complete. Verified responsive structures, accessibility wrappers, atomic form inputs, custom loader animations, and stateless context stores.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout Showcase */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Card 1: Buttons & Inputs UI controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Atomic Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Button Variant Showcase */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Button States & Variants
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Button variant="primary" size="sm">Small size</Button>
                  <Button variant="primary" size="lg">Large size</Button>
                  <Button variant="primary" isLoading>Loading State</Button>
                </div>
              </div>

              {/* Form Input Showcase */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Input Scaffolds
                </h4>
                <Input
                  label="Target Job Role"
                  placeholder="e.g. Senior Backend Architect"
                  icon={<Sparkles className="h-4 w-4" />}
                />
                <Input
                  label="Salary Range (Lakhs/annum)"
                  placeholder="e.g. 48"
                  error="Must be a valid positive integer"
                />
              </div>

            </CardContent>
          </Card>

          {/* Card 2: Shell systems & Context controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Context Alert triggers & skeletons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Global Toast trigger controls */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Stateless Toasts (Zustand dispatchers)
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trigger global notifications to verify responsive overlays, timer auto-clearing intervals, and alert icons:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Button variant="outline" onClick={triggerTestSuccessToast}>
                    Success Alert
                  </Button>
                  <Button variant="outline" onClick={triggerTestWarningToast}>
                    Warning Alert
                  </Button>
                </div>
              </div>

              {/* Skeleton Animation Placeholders */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Placeholder Skeletons
                </h4>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default App;
