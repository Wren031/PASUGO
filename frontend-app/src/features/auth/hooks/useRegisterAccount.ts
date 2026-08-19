import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useRegistrationStore } from '@/store/registration-store';
import type { AccountFormValues } from '../types';

export function useRegisterAccount() {
  const role = useRegistrationStore((state) => state.draft.role);
  const setAccount = useRegistrationStore((state) => state.setAccount);

  return useMutation({
    mutationFn: async (values: AccountFormValues) => {
      const { otp } = await authService.register(role, values.email, values.password);
      setAccount(values.email, values.password);
      return { email: values.email, otp };
    },
  });
}