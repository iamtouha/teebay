import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  readonly isLoggedin: boolean;
};
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedin: !!get()?.token,
      logout: () => set({ token: null }),
      setToken: (token) => set({ token }),
    }),
    { name: 'auth' }
  )
);
