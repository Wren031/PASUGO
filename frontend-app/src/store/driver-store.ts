import { create } from 'zustand';
import type { DriverTripEarning } from '@/types/driver';
import type { RideRequest } from '@/types/booking';
import type { LatLng } from '@/types/map';

export type DriverTripPhase = 'idle' | 'going-to-pickup' | 'arrived' | 'on-trip' | 'completed';

interface DriverState {
  online: boolean;
  pendingRequests: RideRequest[];
  incomingRequest: RideRequest | null;
  activeRequest: RideRequest | null;
  phase: DriverTripPhase;
  passengerPosition: LatLng | null;
  route: LatLng[];
  progress: number;
  etaMin: number;
  lastTripEarning: DriverTripEarning | null;
  setOnline: (online: boolean) => void;
  seedRequests: (requests: RideRequest[]) => void;
  emitRequest: () => void;
  acceptRequest: (route: LatLng[], etaMin: number) => void;
  rejectRequest: () => void;
  setPhase: (phase: DriverTripPhase) => void;
  movePassenger: (position: LatLng, progress: number, etaMin: number) => void;
  completeTrip: (earning: DriverTripEarning) => void;
  clearIncoming: () => void;
  resetTrip: () => void;
}

const initialState = {
  online: false,
  pendingRequests: [],
  incomingRequest: null,
  activeRequest: null,
  phase: 'idle' as DriverTripPhase,
  passengerPosition: null,
  route: [],
  progress: 0,
  etaMin: 0,
  lastTripEarning: null,
};

export const useDriverStore = create<DriverState>()((set, get) => ({
  ...initialState,
  setOnline: (online) => set({ online }),
  seedRequests: (requests) => set({ pendingRequests: requests }),
  emitRequest: () => {
    const { pendingRequests, incomingRequest, activeRequest, online } = get();
    if (!online || incomingRequest || activeRequest || pendingRequests.length === 0) return;
    const [next, ...rest] = pendingRequests;
    set({ incomingRequest: next, pendingRequests: rest });
  },
  acceptRequest: (route, etaMin) => {
    const { incomingRequest } = get();
    if (!incomingRequest) return;
    set({
      activeRequest: incomingRequest,
      incomingRequest: null,
      phase: 'going-to-pickup',
      passengerPosition: incomingRequest.pickupCoordinates,
      route,
      progress: 0,
      etaMin,
    });
  },
  rejectRequest: () => set({ incomingRequest: null }),
  setPhase: (phase) => set({ phase }),
  movePassenger: (passengerPosition, progress, etaMin) => set({ passengerPosition, progress, etaMin }),
  completeTrip: (earning) => set({ lastTripEarning: earning, phase: 'completed' }),
  clearIncoming: () => set({ incomingRequest: null }),
  resetTrip: () =>
    set({
      activeRequest: null,
      phase: 'idle',
      passengerPosition: null,
      route: [],
      progress: 0,
      etaMin: 0,
      lastTripEarning: null,
    }),
}));
