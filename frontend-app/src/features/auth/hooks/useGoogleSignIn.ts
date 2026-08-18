import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useAuthStore } from '@/store/auth-store';

export function useGoogleSignIn() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: () => authService.googleSignIn(),
    onSuccess: (session) => {
      login(session);
    },
  });
}