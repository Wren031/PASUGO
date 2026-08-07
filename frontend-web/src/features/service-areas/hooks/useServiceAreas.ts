import { useQuery } from '@tanstack/react-query';
import { serviceAreaService } from '../services/serviceAreaService';

export function useServiceAreas() {
  return useQuery({ queryKey: ['service-areas', 'cities'], queryFn: serviceAreaService.getCities });
}

export function useRestrictedAreas() {
  return useQuery({ queryKey: ['service-areas', 'restricted'], queryFn: serviceAreaService.getRestrictedAreas });
}

export function useOperatingHours() {
  return useQuery({ queryKey: ['service-areas', 'hours'], queryFn: serviceAreaService.getOperatingHours });
}
