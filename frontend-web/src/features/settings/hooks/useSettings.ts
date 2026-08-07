import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import type { GeneralSettings, NotificationSettings, OperatingSettings, PaymentSettings, SecuritySettings } from '../types';

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: settingsService.getAll });
}

function useUpdateSettings<T>(updateFn: (settings: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export const useUpdateGeneral = () => useUpdateSettings<GeneralSettings>(settingsService.updateGeneral);
export const useUpdateOperating = () => useUpdateSettings<OperatingSettings>(settingsService.updateOperating);
export const useUpdatePayment = () => useUpdateSettings<PaymentSettings>(settingsService.updatePayment);
export const useUpdateSecurity = () => useUpdateSettings<SecuritySettings>(settingsService.updateSecurity);
export const useUpdateNotifications = () => useUpdateSettings<NotificationSettings>(settingsService.updateNotifications);
