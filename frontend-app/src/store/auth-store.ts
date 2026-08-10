import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthSession } from '@/types/user';

interface AuthState {
  session: AuthSession | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (session: AuthSession) => void;
  updateUser: (patch: Partial<AuthSession['user']>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (session) => set({ session }),
      updateUser: (patch) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, user: { ...state.session.user, ...patch } }
            : state.session,
        })),
      logout: () => set({ session: null }),
    }),
    {
      name: 'hatodgo-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const selectSession = (state: AuthState) => state.session;
export const selectUser = (state: AuthState) => state.session?.user ?? null;
export const selectRole = (state: AuthState) => state.session?.user.role ?? null;
