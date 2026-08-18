import { useMutation } from '@tanstack/react-query';
import { useRegistrationStore } from '@/store/registration-store';

export function useGoogleRegister() {
  const role = useRegistrationStore((state) => state.draft.role);
  const setProvider = useRegistrationStore((state) => state.setProvider);
  const setAccount = useRegistrationStore((state) => state.setAccount);
  const setOtpVerified = useRegistrationStore((state) => state.setOtpVerified);

  return useMutation({
    mutationFn: async () => {
      setProvider('google');
      setAccount('google.user@gmail.com', '');
      setOtpVerified();
      return { role };
    },
  });
}