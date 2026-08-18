import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useRegistrationStore } from '@/store/registration-store';
import type { AccountFormValues } from '../types';

export function useRegisterAccount() {
  const role = useRegistrationStore((state) => state.draft.role);
  const setAccount = useRegistrationStore((state) => state.setAccount);

  return useMutation({
    mutationFn: async (values: AccountFormValues) => {
      await authService.checkEmailAvailable(values.email);
      const { otp } = await authService.requestOtp(role, values.email);
      setAccount(values.email, values.password);
      return { email: values.email, otp };
    },
  });
}