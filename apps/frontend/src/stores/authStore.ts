import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../utils/types';

type AuthStore = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUserData: (user: User) => void;
  logout: () => void;
  readonly isLoggedin: boolean;
};
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoggedin: !!get()?.token,
      setToken: (token) => set({ token }),
      setUserData: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth' }
  )
);
