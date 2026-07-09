/**
 * @file StudyPlanner.tsx
 * @description Study curriculum planner calendar scheduler */

import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

interface PlannerTask {
  id: string;
  day: string;
  topic: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const initialTasks: PlannerTask[] = [
  { id: 't-1', day: 'Monday', topic: 'React 19 Hooks & Compiler optimization details', duration: '2 hours', status: 'completed' },
  { id: 't-2', day: 'Wednesday', topic: 'Zustand persistent local storage synchronization patterns', duration: '1.5 hours', status: 'in-progress' },
  { id: 't-3', day: 'Friday', topic: 'Express rate limiters & sequential embedding calculations', duration: '2 hours', status: 'pending' },
];

export function StudyPlanner() {
  const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);

  const cycleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatusMap: Record<PlannerTask['status'], PlannerTask['status']> = {
            'pending': 'in-progress',
            'in-progress': 'completed',
            'completed': 'pending',
          };
          return { ...t, status: nextStatusMap[t.status] };
        }
        return t;
      })
    );
  };

  const getStatusIcon = (status: PlannerTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />;
      default:
        return <Circle className="h-4.5 w-4.5 text-muted-foreground" />;
    }
  };

  const getStatusStyles = (status: PlannerTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'in-progress':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default:
        return 'bg-muted border-border/40 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
          <Calendar className="h-4.5 w-4.5 text-primary" />
          Weekly Study Planner
        </h3>
        <span className="text-[10px] text-muted-foreground">Click card status to cycle</span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <Card
            key={task.id}
            onClick={() => cycleStatus(task.id)}
            className="cursor-pointer hover:bg-accent/30 transition-colors select-none"
          >
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">{getStatusIcon(task.status)}</div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground block">
                    {task.day} • {task.duration}
                  </span>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {task.topic}
                  </p>
                </div>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0
                  ${getStatusStyles(task.status)}
                `}
              >
                {task.status.replace('-', ' ')}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StudyPlanner;
