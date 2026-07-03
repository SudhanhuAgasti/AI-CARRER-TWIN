/**
 * @file Dashboard.tsx
 * @description Main Readiness Dashboard panel displaying score modules and Recharts visualizations.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import SkillRadarChart from '../components/SkillRadarChart';
import ProgressLineChart from '../components/ProgressLineChart';
import { Award, Briefcase, FileText, CheckCircle2, ArrowUpRight, PlusCircle, Volume2, Shield } from 'lucide-react';

interface Activity {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  timestamp: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info';
}

const recentActivities: Activity[] = [
  {
    id: 'act-1',
    icon: FileText,
    description: 'Scanned new Resume matching Staff Architect role',
    timestamp: '2 hours ago',
    badge: '88% ATS Score',
    badgeType: 'success',
  },
  {
    id: 'act-2',
    icon: Volume2,
    description: 'Completed speech mock interview session',
    timestamp: 'Yesterday',
    badge: '7.8/10 Score',
    badgeType: 'info',
  },
  {
    id: 'act-3',
    icon: Shield,
    description: 'Passed container sandbox sandbox execution checks',
    timestamp: '3 days ago',
    badge: '14/14 Passed',
    badgeType: 'success',
  },
];

export function Dashboard() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const handleQuickAction = (actionName: string) => {
    addToast({
      type: 'info',
      title: 'Action Triggered',
      message: `Navigating to ${actionName}...`,
    });
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Hero Welcome Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/8,transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome Back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              Target Role: <span className="font-semibold text-foreground">{user?.role || 'Full Stack Engineer'}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button size="sm" onClick={() => handleQuickAction('Resume Scanners')}>
              <PlusCircle className="mr-1.5 h-4 w-4" />
              New Scan
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Readiness Index Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Readiness Score
              </span>
              <Award className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">79%</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                +4% this week
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '79%' }} />
            </div>
          </CardContent>
        </Card>

        {/* ATS Overlap Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ATS Match Rate
              </span>
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">84%</span>
              <span className="text-[10px] font-bold text-emerald-500">
                Optimal
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: '84%' }} />
            </div>
          </CardContent>
        </Card>

        {/* Interview Rank Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Interview Rank
              </span>
              <Volume2 className="h-4.5 w-4.5 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">72%</span>
              <span className="text-[10px] font-bold text-amber-500">
                Above Avg
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: '72%' }} />
            </div>
          </CardContent>
        </Card>

        {/* Sandbox Success rate Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Code Success
              </span>
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">91%</span>
              <span className="text-[10px] font-bold text-emerald-500">
                100% Secure
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '91%' }} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Skill Gap Coverage Chart Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skill Gap Map</CardTitle>
              <span className="text-[11px] text-muted-foreground">Vs Market Benchmarks</span>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <SkillRadarChart />
          </CardContent>
        </Card>

        {/* Score Timeline Progress Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Readiness Timeline</CardTitle>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +34% over 6w
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressLineChart />
          </CardContent>
        </Card>

      </div>

      {/* Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Recent Activity Timeline panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
          <Card>
            <CardContent className="divide-y divide-border/40 p-0">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                
                return (
                  <div key={act.id} className="flex items-start gap-4 p-5 hover:bg-muted/10 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground leading-normal">{act.description}</p>
                        {act.badge && (
                          <span className="shrink-0 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                            {act.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{act.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Actions panel */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Actions Shortcuts</h3>
          <Card>
            <CardContent className="p-4 space-y-2">
              <button
                onClick={() => handleQuickAction('ATS Analyzer')}
                className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-card p-3.5 hover:bg-accent text-left transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground block">ATS Overlap Checker</span>
                  <span className="text-[10px] text-muted-foreground block">Scan details of resume matching JD.</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <button
                onClick={() => handleQuickAction('Mock Interviews Lobby')}
                className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-card p-3.5 hover:bg-accent text-left transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground block">Start Speech Sandbox</span>
                  <span className="text-[10px] text-muted-foreground block">Initiate simulated mock interview loops.</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
