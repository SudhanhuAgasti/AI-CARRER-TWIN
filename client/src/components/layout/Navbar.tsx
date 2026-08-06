/**
 * @file Navbar.tsx
 * @description Premium responsive application top navigation bar matching the mock UI layout.
 */

import { useState } from 'react';
import { 
  Menu, 
  Moon, 
  Sun, 
  Monitor, 
  LogOut, 
  User, 
  Settings, 
  Sparkles, 
  Bell, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import { useUIStore, type Theme } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';

export function Navbar() {
  const { theme, setTheme, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout request failed on backend:', e);
    }
    clearAuth();
  };

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem] text-pink-400" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />;
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -8,
      transition: { duration: 0.15 }
    }
  } as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Left Side: Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 hover:bg-accent text-foreground transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center/Search Bar (only on md and up) */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search careers, skills, resumes..." 
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:border-pink-500/40 focus:ring-1 focus:ring-pink-500/20 text-white transition-all"
          />
          <div className="absolute right-3 px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/10 text-[9px] font-bold text-muted-foreground flex items-center gap-0.5 select-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Right Side Theme, Notifications, AI Button, User Profile */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Ask AI Pink Gradient Button */}
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-md shadow-pink-500/10 transition-all select-none cursor-pointer">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>Ask AI</span>
          </button>

          {/* Notification Icon with Pink Badge */}
          <div className="relative">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-muted-foreground hover:text-white transition-colors relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-pink-500 border-2 border-background text-[9px] font-extrabold text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowProfileMenu(false);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-muted-foreground hover:text-white transition-all cursor-pointer"
              aria-label="Switch Theme"
            >
              {getThemeIcon(theme)}
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-card p-1 shadow-xl z-50"
                >
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        setShowThemeMenu(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold capitalize text-left transition-colors hover:bg-accent hover:text-accent-foreground ${theme === t ? 'text-pink-500 bg-pink-500/5' : 'text-muted-foreground'
                        }`}
                    >
                      {getThemeIcon(t)}
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile User Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowThemeMenu(false);
                }}
                className="flex items-center gap-2 rounded-xl p-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors cursor-pointer select-none"
                aria-label="User profile menu"
              >
                <div className="h-7 w-7 rounded-lg overflow-hidden bg-pink-500/10 flex items-center justify-center text-xs font-bold text-pink-500 uppercase select-none">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline-block text-xs font-bold text-white">
                  {user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-xl z-50 text-left"
                  >
                    <div className="px-3.5 py-2.5 border-b border-border/40">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Link>
                    </div>

                    <div className="border-t border-border/40 p-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
