import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { useRegistrationStore } from '@/store/registration-store';
import type { RegistrationDraft } from '../types';

export function useCompleteRegistration() {
  const login = useAuthStore((state) => state.login);
  const reset = useRegistrationStore((state) => state.reset);

  return useMutation({
    mutationFn: (draft: RegistrationDraft) => authService.completeRegistration(draft),
    onSuccess: (session) => {
      reset();
      login(session);
    },
  });
}