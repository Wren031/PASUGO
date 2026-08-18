import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';

export function useValidateInvitationCode() {
  return useMutation({
    mutationFn: (code: string) => authService.validateInvitationCode(code),
  });
}