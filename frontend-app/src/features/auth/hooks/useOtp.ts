import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useRegistrationStore } from '@/store/registration-store';
import type { RegistrationRole } from '../types';

export function useVerifyOtp() {
  const role = useRegistrationStore((state) => state.draft.role);
  const email = useRegistrationStore((state) => state.draft.email);
  const setOtpVerified = useRegistrationStore((state) => state.setOtpVerified);

  return useMutation({
    mutationFn: (otp: string) => authService.verifyOtp(role, email, otp),
    onSuccess: () => {
      setOtpVerified();
    },
  });
}

export function useRequestOtp() {
  const role = useRegistrationStore((state) => state.draft.role);
  const email = useRegistrationStore((state) => state.draft.email);

  return useMutation({
    mutationFn: () => authService.requestOtp(role, email),
  });
}