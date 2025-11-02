// src/store/authStore.js
import { create } from 'zustand';
import type { UserInfo } from '../Types/userInfo';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: UserInfo | null;
  isAuth: boolean;
  login: (userData: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      login: (userData: UserInfo) => set({ user: userData, isAuth: true }),
      logout: () => set({ user: null, isAuth: false }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      storage : createJSONStorage(() => localStorage),
    }
  )
);