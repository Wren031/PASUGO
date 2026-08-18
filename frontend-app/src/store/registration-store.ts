import { create } from 'zustand';
import type { RegistrationDraft } from '@/features/auth/types';

interface RegistrationState {
  draft: RegistrationDraft;
  setRole: (role: RegistrationDraft['role']) => void;
  setProvider: (provider: RegistrationDraft['provider']) => void;
  setInvitationCode: (code: string) => void;
  setAccount: (email: string, password: string) => void;
  setOtpVerified: () => void;
  setProfile: (profile: NonNullable<RegistrationDraft['profile']>) => void;
  setDocuments: (documents: RegistrationDraft['documents']) => void;
  reset: () => void;
}

const initialDraft: RegistrationDraft = {
  role: 'passenger',
  provider: 'email',
  invitationCode: '',
  email: '',
  password: '',
  otpVerified: false,
  profile: null,
  documents: [],
};

export const useRegistrationStore = create<RegistrationState>()((set) => ({
  draft: initialDraft,
  setRole: (role) => set((state) => ({ draft: { ...state.draft, role } })),
  setProvider: (provider) => set((state) => ({ draft: { ...state.draft, provider } })),
  setInvitationCode: (code) => set((state) => ({ draft: { ...state.draft, invitationCode: code } })),
  setAccount: (email, password) => set((state) => ({ draft: { ...state.draft, email, password } })),
  setOtpVerified: () => set((state) => ({ draft: { ...state.draft, otpVerified: true } })),
  setProfile: (profile) => set((state) => ({ draft: { ...state.draft, profile } })),
  setDocuments: (documents) => set((state) => ({ draft: { ...state.draft, documents } })),
  reset: () => set({ draft: initialDraft }),
}));