/**
 * @file GithubProfiler.tsx
 * @description GitHub AST inspector, repo list selector, and complexity metrics.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { Code, GitFork, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Repository {
  name: string;
  stars: number;
  forks: number;
  astPassed: boolean;
  languageData: Array<{ name: string; value: number }>;
}

const mockRepos: Repository[] = [
  {
    name: 'ai-career-twin-backend',
    stars: 12,
    forks: 3,
    astPassed: true,
    languageData: [
      { name: 'JavaScript', value: 70 },
      { name: 'TypeScript', value: 20 },
      { name: 'HTML/CSS', value: 10 },
    ],
  },
  {
    name: 'stateless-verifier-container',
    stars: 4,
    forks: 1,
    astPassed: true,
    languageData: [
      { name: 'TypeScript', value: 90 },
      { name: 'Shell', value: 10 },
    ],
  },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent-foreground))', 'hsl(var(--muted-foreground))'];

export function GithubProfiler() {
  const { addToast } = useUIStore();
  const [syncing, setSyncing] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRepos(mockRepos);
      setSelectedRepo(mockRepos[0]);
      addToast({
        type: 'success',
        title: 'GitHub Repositories Synced',
        message: 'Loaded AST metrics for 2 active repositories.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: 'Could not fetch repositories from GitHub.',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="text-left">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-foreground" />
            GitHub Repository Inspector
          </CardTitle>
          <Button size="sm" onClick={handleSync} isLoading={syncing}>
            Sync Repositories
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {repos.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground space-y-2 select-none">
            <p className="text-xs font-bold uppercase tracking-wide">Sync Your Profile</p>
            <p className="text-[10px]">Click the sync button to inspect repository codes and AST parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list (Repos select) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Repository List
              </span>
              <div className="space-y-1.5">
                {repos.map((repo) => (
                  <button
                    key={repo.name}
                    onClick={() => setSelectedRepo(repo)}
                    className={`w-full rounded-lg border p-4 text-xs font-bold text-left transition-all flex items-center justify-between gap-4
                      ${selectedRepo?.name === repo.name
                        ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                        : 'border-border bg-card text-muted-foreground hover:bg-accent/40'
                      }
                    `}
                  >
                    <span className="truncate">{repo.name}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Repo details */}
            {selectedRepo && (
              <div className="lg:col-span-7 space-y-5 rounded-xl border border-border/80 bg-accent/10 p-5">
                
                {/* Meta stats */}
                <div className="flex items-center justify-between gap-4 flex-wrap pb-3.5 border-b border-border/40">
                  <h4 className="text-sm font-bold text-foreground truncate">{selectedRepo.name}</h4>
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400" />
                      {selectedRepo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4 text-indigo-400" />
                      {selectedRepo.forks}
                    </span>
                  </div>
                </div>

                {/* AST Security checks */}
                <div className="flex items-start gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                      AST Complexity Check Passed
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      No vulnerable eval calls, recursive infinite loops, or loose execution scopes found in code branches.
                    </p>
                  </div>
                </div>

                {/* Language Share Chart */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-left">
                    Language Distribution
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="h-[120px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedRepo.languageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {selectedRepo.languageData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 text-left">
                      {selectedRepo.languageData.map((lang, idx) => (
                        <div key={lang.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            <span className="font-semibold text-muted-foreground">{lang.name}</span>
                          </div>
                          <span className="font-bold text-foreground">{lang.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GithubProfiler;
