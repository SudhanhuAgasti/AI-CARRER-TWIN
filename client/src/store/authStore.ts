/**
 * @file authStore.ts
 * @description Zustand global store for client authentication state.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  setAuth: (token: string, refreshToken: string, user: UserProfile) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      clearAuth: () => set({ token: null, refreshToken: null, user: null }),
    }),
    {
      name: 'ai-career-twin-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
