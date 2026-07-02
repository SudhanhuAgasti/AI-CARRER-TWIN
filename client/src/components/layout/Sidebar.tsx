/**
 * @file Sidebar.tsx
 * @description Collapsible navigation sidebar mapping feature routes.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { LayoutDashboard, FileText, MessageSquare, Globe, Settings, X, GraduationCap } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { type ComponentType } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Readiness Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume + ATS Analyzer', href: '/resume', icon: FileText },
  { name: 'Skill Gap & Planner', href: '/skill-gap', icon: GraduationCap },
  { name: 'Mock Interviews', href: '/interview', icon: MessageSquare },
  { name: 'LinkedIn Optimizer', href: '/linkedin', icon: Globe },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, setSidebar } = useUIStore();

  const activeHref = window.location.pathname; // Simulated path selection for standalone route integrations

  return (
    <>
      {/* Mobile Sidebar backdrop screen overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:sticky md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header container */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-foreground">Navigation Menu</span>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 select-none
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40">
          <div className="rounded-lg bg-accent/40 border border-border/40 p-3.5 text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Need Assistance?
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Contact our engineering mentors or consult documentation details.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
