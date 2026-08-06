/**
 * @file Sidebar.tsx
 * @description Collapsible navigation sidebar mapping feature routes matching the reference UI design.
 */

import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  X, 
  GraduationCap, 
  Terminal, 
  Github, 
  Linkedin, 
  BarChart3, 
  User, 
  Sparkles, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../api/axiosInstance';

interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analyzer', href: '/resume', icon: FileText },
  { name: 'ATS Analysis', href: '/resume', icon: FileText }, // Map to same route or similar
  { name: 'GitHub Analyzer', href: '/copilot', icon: Github },
  { name: 'LinkedIn Analyzer', href: '/linkedin', icon: Linkedin },
  { name: 'Learning Roadmap', href: '/skill-gap', icon: GraduationCap },
  { name: 'Mock Interview', href: '/interview', icon: MessageSquare },
  { name: 'Coding Sandbox', href: '/sandbox', icon: Terminal },
  { name: 'Reports', href: '/dashboard', icon: BarChart3 },
  { name: 'Profile', href: '/settings', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, setSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const activeHref = location.pathname;

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout request failed on backend:', e);
    }
    clearAuth();
  };

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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 
          md:sticky md:top-0 md:h-screen md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header container matching the Pink Box Logo & Subtitle */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            {/* Pink Logo Box */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 shadow-md shadow-pink-500/20 text-white font-bold shrink-0">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                AI Career Twin
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Your AI Career Partner
              </span>
            </div>
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
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto relative custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href || (item.name === 'Dashboard' && activeHref === '/');

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 select-none
                  ${isActive
                    ? 'text-white font-bold bg-gradient-to-r from-pink-500/10 to-rose-500/20 border border-pink-500/20 shadow-[0_0_15px_-3px_rgba(236,72,153,0.15)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.02]'
                  }
                `}
              >
                <span className="relative z-10 flex items-center gap-3 w-full">
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-pink-500' : 'text-muted-foreground'}`} />
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Pro Plan Card */}
          <div className="mt-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] p-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 blur-xl rounded-full" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 uppercase tracking-wider mb-0.5">
              <Sparkles className="h-3 w-3" />
              Pro Plan
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Renews on 24 May, 2024</p>
            <button className="w-full py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-[11px] font-extrabold text-pink-500 transition-all select-none">
              Upgrade Plan
            </button>
          </div>
        </nav>

        {/* Sidebar Footer detailing User credentials */}
        <div className="p-4 border-t border-border/40 shrink-0 space-y-4">
          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-white/10 bg-muted flex items-center justify-center text-xs font-bold text-pink-500">
                {user?.name ? user.name.charAt(0) : 'S'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.name || 'Sudhanshu'}
                </span>
                <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">
                  {user?.email || 'sudhanshu@example.com'}
                </span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Storage Meter */}
          <div className="space-y-1 px-1">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>Storage</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-pink-500" style={{ width: '24%' }} />
            </div>
          </div>

          {/* AI Credits Meter */}
          <div className="space-y-1 px-1">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>AI Credits</span>
              <span>1,240 / 2,000</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-pink-500" style={{ width: '62%' }} />
            </div>
          </div>

          {/* Logout Action */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-1 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
