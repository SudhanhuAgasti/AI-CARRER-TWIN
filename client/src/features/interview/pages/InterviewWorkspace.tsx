/**
 * @file InterviewWorkspace.tsx
 * @description Parent Mock Interview workspace coordinating setup lobby, live chat session, and feedback scorecards.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import InterviewLobby from '../components/InterviewLobby';
import InterviewChat from '../components/InterviewChat';
import InterviewFeedback from '../components/InterviewFeedback';

type ActivePhase = 'lobby' | 'session' | 'feedback';

interface InterviewSettings {
  role: string;
  difficulty: string;
  duration: number;
}

export function InterviewWorkspace() {
  const [phase, setPhase] = useState<ActivePhase>('lobby');
  const [settings, setSettings] = useState<InterviewSettings>({
    role: 'Senior Software Engineer',
    difficulty: 'senior',
    duration: 15,
  });

  const handleStartSession = (selectedSettings: InterviewSettings) => {
    setSettings(selectedSettings);
    setPhase('session');
  };

  const handleFinishSession = () => {
    setPhase('feedback');
  };

  const handleRestart = () => {
    setPhase('lobby');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Workspace Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Mock Interview Simulator</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Practice technical screens, code design explanations, and analyze articulation speeds.
        </p>
      </div>

      <div className="animate-in fade-in duration-200">
        {phase === 'lobby' && (
          <InterviewLobby onStart={handleStartSession} />
        )}
        
        {phase === 'session' && (
          <InterviewChat settings={settings} onFinish={handleFinishSession} />
        )}
        
        {phase === 'feedback' && (
          <InterviewFeedback onRestart={handleRestart} />
        )}
      </div>

    </div>
  );
}

export default InterviewWorkspace;
