/**
 * @file Navbar.tsx
 * @description Premium responsive application top navigation bar
 */

import { useState } from 'react';
import { Menu, Moon, Sun, Monitor, LogOut, User, Settings } from 'lucide-react';
import { useUIStore, type Theme } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, setTheme, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
  };

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />;
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
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Left Side: Mobile Menu Button & Brand logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 hover:bg-accent text-foreground transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="logo-gradient font-bold text-lg tracking-tight select-none">
              AI Career Twin
            </span>
            <span className="hidden sm:inline-block rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary tracking-wider uppercase">
              Beta
            </span>
          </div>
        </div>

        {/* Right Side: Theme Controls & User Actions */}
        <div className="flex items-center gap-3">

          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowProfileMenu(false);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 hover:bg-accent text-foreground transition-all duration-200"
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
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold capitalize text-left transition-colors hover:bg-accent hover:text-accent-foreground ${theme === t ? 'text-primary bg-primary/5' : 'text-muted-foreground'
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

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowThemeMenu(false);
                }}
                className="flex items-center gap-2 rounded-full p-0.5 border border-border/80 bg-card hover:bg-accent transition-colors"
                aria-label="User profile menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase select-none">
                  {user.name.charAt(0)}
                </div>
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
                      <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                      <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </button>
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
