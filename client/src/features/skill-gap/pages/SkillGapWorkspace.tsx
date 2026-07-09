/**
 * @file SkillGapWorkspace.tsx
 * @description Parent Skill Gap planning workspace linking trackers, timelines, and micro-projects */

import { useState } from 'react';
import RoleSelector from '../components/RoleSelector';
import RoadmapTimeline from '../components/RoadmapTimeline';
import StudyPlanner from '../components/StudyPlanner';
import MicroProjects from '../components/MicroProjects';
import { Card, CardContent } from '../../../components/ui/Card';

export function SkillGapWorkspace() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-1');

  return (
    <div className="space-y-6 text-left">

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Skill Gap & Learning Planner</h1>
          <p className="text-xs text-muted-foreground">
            Construct customized learning timelines, daily schedules, and practice sandboxed containers targeting specific vacancies.
          </p>
        </div>

        {/* Role Selector Trigger */}
        <div className="shrink-0">
          <RoleSelector selectedRoleId={selectedRoleId} onRoleSelect={setSelectedRoleId} />
        </div>
      </div>

      {/* 2-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Milestones node timeline (take up 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <RoadmapTimeline selectedRoleId={selectedRoleId} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Weekly study plan scheduler & micro tasks (take up 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <StudyPlanner />
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Full Width bottom row: Recommended coding micro projects sandbox */}
      <div className="pt-2">
        <MicroProjects selectedRoleId={selectedRoleId} />
      </div>

    </div>
  );
}

export default SkillGapWorkspace;
