/**
 * @file RoadmapTimeline.tsx
 * @description Interactive milestone roadmap nodes tracker */

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import { useResumeStore } from '../../../store/resumeStore';

interface MilestoneNode {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  links: Array<{ name: string; url: string }>;
  completed: boolean;
}

const mockTimelineData: Record<string, MilestoneNode[]> = {
  'role-1': [
    {
      id: 'ms-1',
      phase: 'Phase 1',
      title: 'Advanced React Architecture',
      duration: '1-2 weeks',
      description: 'Master React 19 compiler optimizations, layout guards routing structures, and global Zustand/TanStack client caching stores.',
      skills: ['React 19', 'Zustand', 'TypeScript', 'Tailwind v4'],
      links: [{ name: 'React 19 Docs', url: 'https://react.dev' }],
      completed: true,
    },
    {
      id: 'ms-2',
      phase: 'Phase 2',
      title: 'System Design & High Concurrency Backend services',
      duration: '2-3 weeks',
      description: 'Build robust REST APIs, sequential LLM embedding flows, rate limiting, and process hooks configurations.',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'Rate Limits'],
      links: [{ name: 'Express Optimization Guide', url: 'https://expressjs.com' }],
      completed: false,
    },
    {
      id: 'ms-3',
      phase: 'Phase 3',
      title: 'Docker Sandbox Containers & Sandbox Security',
      duration: '1 week',
      description: 'Implement secure sandbox execution environments, process telemetry log catchers, and HMAC cryptographical tokens.',
      skills: ['Docker Sandbox', 'Cryptography (HMAC)', 'Node.js Cluster'],
      links: [{ name: 'Node Crypto API', url: 'https://nodejs.org' }],
      completed: false,
    },
  ],
  'role-2': [
    {
      id: 'ms-arch-1',
      phase: 'Phase 1',
      title: 'System Scale & Data Partitioning',
      duration: '2 weeks',
      description: 'Configure MongoDB replication, sharding mechanisms, indexing optimizations, and transactional rollback boundaries.',
      skills: ['MongoDB Sharding', 'Database Scaling', 'Aggregation Engine'],
      links: [{ name: 'MongoDB Aggregations Guide', url: 'https://mongodb.com' }],
      completed: true,
    },
    {
      id: 'ms-arch-2',
      phase: 'Phase 2',
      title: 'Isolated Code Simulation Container Telemetry',
      duration: '2 weeks',
      description: 'Deploy isolated environments inside Linux cgroups/namespaces, verifying and logging process memory heap metrics.',
      skills: ['Linux Namespaces', 'Sandbox Security', 'Node OS API'],
      links: [{ name: 'Docker Security Policies', url: 'https://docker.com' }],
      completed: false,
    },
  ],
};

interface RoadmapTimelineProps {
  selectedRoleId: string;
}

export function RoadmapTimeline({ selectedRoleId }: RoadmapTimelineProps) {
  const [nodes, setNodes] = useState<MilestoneNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string>('');
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const resumeSkills = useResumeStore.getState().structuredResume?.skills || ['React', 'NodeJS', 'Express'];
        const resumeId = useResumeStore.getState().resumeId || undefined;

        const roleMap: Record<string, string> = {
          'role-1': 'fullstack-engineer',
          'role-2': 'backend-engineer',
          'role-3': 'frontend-engineer',
        };
        const targetRole = roleMap[selectedRoleId] || 'fullstack-engineer';

        const response = await axiosInstance.post('/api/planner/roadmap', {
          resumeSkills,
          targetRole,
          availableHoursPerDay: 2,
          resumeId
        });

        const apiSteps = response.data?.roadmapSteps || response.data?.steps || [];
        const mappedNodes: MilestoneNode[] = apiSteps.map((step: any, idx: number) => ({
          id: `ms-api-${idx}`,
          phase: `Phase ${idx + 1}`,
          title: step.title || step.topic,
          duration: step.duration || '1 week',
          description: step.description || 'Focus on architectural patterns.',
          skills: step.skills || [],
          links: step.resources?.map((res: any) => ({ name: res.name || 'Resource', url: res.url || '#' })) || [],
          completed: false,
        }));

        if (mappedNodes.length > 0) {
          setNodes(mappedNodes);
          setActiveNodeId(mappedNodes[0].id);
          setCompletedNodeIds([]);
        } else {
          const defaultNodes = mockTimelineData[selectedRoleId] || mockTimelineData['role-1'];
          setNodes(defaultNodes);
          setActiveNodeId(defaultNodes[0]?.id || '');
          setCompletedNodeIds(defaultNodes.filter((n) => n.completed).map((n) => n.id));
        }
      } catch (err) {
        const defaultNodes = mockTimelineData[selectedRoleId] || mockTimelineData['role-1'];
        setNodes(defaultNodes);
        setActiveNodeId(defaultNodes[0]?.id || '');
        setCompletedNodeIds(defaultNodes.filter((n) => n.completed).map((n) => n.id));
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [selectedRoleId]);

  const toggleComplete = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setCompletedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="text-sm font-bold text-foreground">Interactive Roadmap Timeline</h3>
        <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-semibold">
          {completedNodeIds.length} / {nodes.length} Phases Done
        </span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-xs text-muted-foreground animate-pulse">
          Analyzing career path and generating your custom learning roadmap...
        </div>
      ) : (
        <div className="relative border-l border-border/60 pl-6 ml-3.5 space-y-6">
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isDone = completedNodeIds.includes(node.id);

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className="relative cursor-pointer group select-none"
              >

                {/* Timeline marker icon */}
                <div className="absolute -left-9.5 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border transition-colors group-hover:border-primary">
                  {isDone ? (
                    <button onClick={(e) => toggleComplete(e, node.id)} aria-label="Mark incomplete">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    </button>
                  ) : (
                    <button onClick={(e) => toggleComplete(e, node.id)} aria-label="Mark complete">
                      <Circle className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Node Summary details */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                        {node.phase} ({node.duration})
                      </span>
                      <h4 className="text-sm font-bold text-foreground leading-normal block group-hover:text-primary transition-colors">
                        {node.title}
                      </h4>
                    </div>
                    <ChevronRight
                      className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 shrink-0
                      ${isActive ? 'rotate-90 text-primary' : ''}
                    `}
                    />
                  </div>

                  {/* Collapsible active node body details */}
                  {isActive && (
                    <div className="rounded-lg bg-card border border-border p-4.5 space-y-4.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {node.description}
                      </p>

                      {/* Skill tags */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Core Skill Benchmarks
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {node.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border/40"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Study resources links */}
                      {node.links.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Curated Material
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {node.links.map((link) => (
                              <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                {link.name}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoadmapTimeline;
