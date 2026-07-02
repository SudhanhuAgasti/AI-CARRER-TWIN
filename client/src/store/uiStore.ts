/**
 * @file uiStore.ts
 * @description Zustand global store for client UI configurations, theme states, and system notifications.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      toasts: [],
      setTheme: (theme) => {
        set({ theme });
        // Sync HTML class for tailwind styling rules
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebar: (sidebarOpen) => set({ sidebarOpen }),
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'ai-career-twin-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist theme and sidebar settings, skip transient toasts
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);
