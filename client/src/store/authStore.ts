/**
 * @file authStore.ts
 * @description Zustand global store for client authentication state.
 * Implements token isolation by storing tokens in-memory and persisting only non-sensitive profile details.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  token: string | null; // In-memory short-lived access token
  user: UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'ai-career-twin-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive user details, keep the access token in RAM
      partialize: (state) => ({ user: state.user }),
    }
  )
);
