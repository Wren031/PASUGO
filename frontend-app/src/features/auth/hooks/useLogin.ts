import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import type { LoginPayload } from '@/types/user';

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (session) => {
      login(session);
    },
  });
}
