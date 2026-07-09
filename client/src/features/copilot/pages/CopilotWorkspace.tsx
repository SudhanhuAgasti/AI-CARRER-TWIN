/**
 * @file CopilotWorkspace.tsx
 * @description Tabbed workspace for Career Copilot suite. Refactored to separate components for readability
 */

import { useState } from 'react';
import { Volume2, Landmark, Mail } from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { ElevatorPitchTab } from '../components/ElevatorPitchTab';
import { RecruiterOutreachTab } from '../components/RecruiterOutreachTab';
import { CompensationNegotiationTab } from '../components/CompensationNegotiationTab';

export function CopilotWorkspace() {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'pitch' | 'outreach' | 'negotiation'>('pitch');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Copied successfully!',
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Workspace Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Career &amp; Negotiation Copilot</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Prepare high-impact elevator pitches, recruiter outreach letters, and custom compensation negotiation plans.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-2">
        <button
          onClick={() => setActiveTab('pitch')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'pitch' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Volume2 className="h-4 w-4" />
          Elevator Pitch
        </button>
        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'outreach' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Mail className="h-4 w-4" />
          Recruiter Outreach
        </button>
        <button
          onClick={() => setActiveTab('negotiation')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-colors
            ${activeTab === 'negotiation' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
          `}
        >
          <Landmark className="h-4 w-4" />
          Compensation Negotiation
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {activeTab === 'pitch' && <ElevatorPitchTab handleCopy={handleCopy} />}
        {activeTab === 'outreach' && <RecruiterOutreachTab handleCopy={handleCopy} />}
        {activeTab === 'negotiation' && <CompensationNegotiationTab handleCopy={handleCopy} />}
      </div>
    </div>
  );
}

export default CopilotWorkspace;
