import { create } from 'zustand';
import type { AvailableDriver, Booking, TripPhase } from '@/types/booking';
import type { LatLng } from '@/types/map';

interface RideState {
  booking: Booking | null;
  driver: AvailableDriver | null;
  phase: TripPhase;
  driverPosition: LatLng | null;
  route: LatLng[];
  progress: number;
  etaMin: number;
  distanceToPickupKm: number;
  startRide: (booking: Booking, driver: AvailableDriver, route: LatLng[]) => void;
  setPhase: (phase: TripPhase) => void;
  moveDriver: (position: LatLng, progress: number, etaMin: number, distanceToPickupKm: number) => void;
  cancelRide: (reason: string) => void;
  completeRide: () => void;
  reset: () => void;
}

const initialState = {
  booking: null,
  driver: null,
  phase: 'searching' as TripPhase,
  driverPosition: null,
  route: [],
  progress: 0,
  etaMin: 0,
  distanceToPickupKm: 0,
};

export const useRideStore = create<RideState>()((set) => ({
  ...initialState,
  startRide: (booking, driver, route) =>
    set({
      booking,
      driver,
      route,
      phase: 'searching',
      driverPosition: driver.coordinates,
      progress: 0,
      etaMin: driver.etaMin,
      distanceToPickupKm: driver.distanceKm,
    }),
  setPhase: (phase) => set({ phase }),
  moveDriver: (driverPosition, progress, etaMin, distanceToPickupKm) =>
    set({ driverPosition, progress, etaMin, distanceToPickupKm }),
  cancelRide: (reason) =>
    set((state) => ({
      phase: 'cancelled',
      booking: state.booking ? { ...state.booking, status: 'Cancelled' } : state.booking,
      driver: state.driver,
      route: state.route,
    })),
  completeRide: () => set({ phase: 'completed' }),
  reset: () => set({ ...initialState }),
}));
