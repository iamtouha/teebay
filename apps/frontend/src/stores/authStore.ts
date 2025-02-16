import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  readonly isLoggedin: boolean;
};
const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedin: get().token !== null,
      logout: () => set({ token: null }),
      setToken: (token) => set({ token }),
    }),
    { name: 'auth' }
  )
);

export function useAuth() {
  const store = useStore(authStore);
  return store;
}
