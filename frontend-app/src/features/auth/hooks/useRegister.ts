import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import type { RegisterPayload } from '@/types/user';

export function useRegister() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (session) => {
      login(session);
    },
  });
}
