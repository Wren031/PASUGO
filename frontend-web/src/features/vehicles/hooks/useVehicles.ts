import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';

export function useVehicles() {
  return useQuery({ queryKey: ['vehicles'], queryFn: vehicleService.getVehicles });
}

export function useVehicleStats() {
  return useQuery({ queryKey: ['vehicles', 'stats'], queryFn: vehicleService.getVehicleStats });
}
