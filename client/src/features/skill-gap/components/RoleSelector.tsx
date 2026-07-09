/**
 * @file RoleSelector.tsx
 * @description Target role selection drop-down selector */

import { Briefcase, ChevronDown } from 'lucide-react';

interface RoleOption {
  id: string;
  title: string;
  department: string;
}

const roleOptions: RoleOption[] = [
  { id: 'role-1', title: 'Senior Software Engineer (Full Stack)', department: 'Engineering' },
  { id: 'role-2', title: 'Staff Backend Architect', department: 'Engineering' },
  { id: 'role-3', title: 'Engineering Manager', department: 'Management' },
];

interface RoleSelectorProps {
  selectedRoleId: string;
  onRoleSelect: (roleId: string) => void;
}

export function RoleSelector({ selectedRoleId, onRoleSelect }: RoleSelectorProps) {

  return (
    <div className="space-y-2 text-left w-full max-w-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Select Target Career Path
      </label>
      <div className="relative">
        <select
          value={selectedRoleId}
          onChange={(e) => onRoleSelect(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 pl-10 pr-10 text-xs font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {roleOptions.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title} ({role.department})
            </option>
          ))}
        </select>

        {/* Left Icon decoration */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Briefcase className="h-4 w-4" />
        </div>

        {/* Right Arrow decoration */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Roadmaps, target skills benchmarks, study planners, and micro-projects will adjust automatically based on this selection.
      </p>
    </div>
  );
}

export default RoleSelector;
