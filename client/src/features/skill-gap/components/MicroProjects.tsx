/**
 * @file MicroProjects.tsx
 * @description Recommended coding assignments mapping sandbox telemetry.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { Terminal } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  expectedDuration: string;
  sandboxLink: string;
}

const mockProjects: Record<string, ProjectItem[]> = {
  'role-1': [
    {
      id: 'proj-1',
      title: 'Design an Async Concurrency Throttle Pool',
      difficulty: 'medium',
      description: 'Implement a promise pool wrapper that processes embeddings sequentially or inside bounded queues to prevent LLM API 429 errors.',
      expectedDuration: '60 mins',
      sandboxLink: '/sandbox?project=concurrency-throttle',
    },
    {
      id: 'proj-2',
      title: 'Stateless JWT HMAC Verification Sandbox',
      difficulty: 'hard',
      description: 'Write a stateless container runtime simulated validator signing process log telemetry with crypto HMAC-SHA256 tokens.',
      expectedDuration: '90 mins',
      sandboxLink: '/sandbox?project=hmac-sandbox',
    },
  ],
  'role-2': [
    {
      id: 'proj-arch-1',
      title: 'Implement Database Sharding Simulation',
      difficulty: 'hard',
      description: 'Design mock sharding nodes partitioning client data collections using consistency hashing structures.',
      expectedDuration: '120 mins',
      sandboxLink: '/sandbox?project=sharding-simulation',
    },
  ],
};

interface MicroProjectsProps {
  selectedRoleId: string;
}

export function MicroProjects({ selectedRoleId }: MicroProjectsProps) {
  const { addToast } = useUIStore();
  const projects = mockProjects[selectedRoleId] || mockProjects['role-1'];

  const getDifficultyColor = (diff: ProjectItem['difficulty']) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const startSandbox = (projTitle: string) => {
    addToast({
      type: 'info',
      title: 'Launching Sandbox Container',
      message: `Spanning isolated execution environments for project "${projTitle}"...`,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
          <Terminal className="h-4.5 w-4.5 text-primary" />
          Recommended Micro-Projects
        </h3>
        <span className="text-[10px] text-muted-foreground">Sandbox container links</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => (
          <Card key={proj.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xs font-bold truncate max-w-[200px]">
                  {proj.title}
                </CardTitle>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0
                    ${getDifficultyColor(proj.difficulty)}
                  `}
                >
                  {proj.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pb-5 flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {proj.description}
              </p>
              
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Est. time: {proj.expectedDuration}
                </span>
                <Button size="sm" className="h-8 text-[11px]" onClick={() => startSandbox(proj.title)}>
                  Start Coding Task
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MicroProjects;
