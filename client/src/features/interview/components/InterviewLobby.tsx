/**
 * @file InterviewLobby.tsx
 * @description Setup lobby for Mock Interview selection parameters */

import { useState } from 'react';
import { ShieldCheck, Video, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface InterviewLobbyProps {
  onStart: (settings: { role: string; difficulty: string; duration: number }) => void;
}

export function InterviewLobby({ onStart }: InterviewLobbyProps) {
  const [role, setRole] = useState('Senior Software Engineer');
  const [difficulty, setDifficulty] = useState('senior');
  const [duration, setDuration] = useState(15); // 15 minutes session

  return (
    <Card className="max-w-xl mx-auto text-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Interactive Mock Interview Setup
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">

        {/* Role select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Interview Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. Staff Full Stack Engineer"
          />
        </div>

        {/* Experience level difficulty */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Experience Level / Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {['junior', 'mid', 'senior'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-lg border px-3.5 py-2.5 text-xs font-semibold capitalize transition-all select-none
                  ${difficulty === level
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent/40'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Duration select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Session Duration
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[10, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-all select-none
                  ${duration === mins
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent/40'
                  }
                `}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Security checks notices */}
        <div className="rounded-lg bg-accent/40 border border-border/40 p-3.5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
              Microphone Permission Needed
            </span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              We capture speech telemetry in real-time to analyze articulation speed, syntax structures, and keyword metrics. Audio datasets are processed locally and discarded.
            </p>
          </div>
        </div>

        <Button className="w-full mt-2" onClick={() => onStart({ role, difficulty, duration })}>
          Start Practice Session
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>

      </CardContent>
    </Card>
  );
}

export default InterviewLobby;
