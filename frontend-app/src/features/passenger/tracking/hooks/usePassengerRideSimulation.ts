import { useEffect, useRef } from 'react';
import { useRideStore } from '@/store/ride-store';
import { bookingService } from '@/features/passenger/booking/services/booking-service';
import { SIMULATION } from '@/constants/fare';
import { distancePerTick, etaMinutes, pointAlongRoute, remainingKm } from '@/utils/simulation';
import { routeDistanceKm, haversineKm } from '@/utils/geo';
import type { TripPhase } from '@/types/booking';

const SPEED_KMH = SIMULATION.averageSpeedKmh;

export function usePassengerRideSimulation() {
  const booking = useRideStore((state) => state.booking);
  const driver = useRideStore((state) => state.driver);
  const route = useRideStore((state) => state.route);
  const phase = useRideStore((state) => state.phase);
  const distanceRef = useRef(0);
  const completedRef = useRef(false);

  const leg1Km =
    booking && driver ? haversineKm(driver.coordinates, booking.pickupCoordinates) : 0;
  const totalKm = route.length > 1 ? routeDistanceKm(route) : 0;

  // Hold timers for arriving / picked-up phases
  useEffect(() => {
    if (phase === 'arriving') {
      const timer = setTimeout(() => useRideStore.getState().setPhase('picked-up'), SIMULATION.arrivingHoldMs);
      return () => clearTimeout(timer);
    }
    if (phase === 'picked-up') {
      const timer = setTimeout(() => useRideStore.getState().setPhase('in-trip'), SIMULATION.pickedUpHoldMs);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase]);

  // Movement engine
  useEffect(() => {
    if (!booking || !driver || route.length < 2) return;
    if (phase === 'completed' || phase === 'cancelled' || phase === 'searching') return;

    const interval = setInterval(() => {
      const state = useRideStore.getState();
      const currentPhase = state.phase;
      if (currentPhase === 'completed' || currentPhase === 'cancelled') return;

      if (currentPhase === 'in-trip') {
        distanceRef.current += distancePerTick(SPEED_KMH, SIMULATION.demoTimeScale, SIMULATION.tickMs);
      }

      if (distanceRef.current >= totalKm) {
        if (!completedRef.current) {
          completedRef.current = true;
          state.setPhase('completed');
          void bookingService.updateBookingStatus(booking.id, 'Completed', 'Trip completed');
        }
        return;
      }

      const position = pointAlongRoute(route, distanceRef.current);
      const remaining = remainingKm(route, distanceRef.current);
      const distanceToPickup = Math.max(0, leg1Km - distanceRef.current);

      let nextPhase = state.phase;
      if (state.phase === 'accepted' && distanceRef.current >= leg1Km) {
        nextPhase = 'arriving';
      }
      if (nextPhase !== state.phase) {
        state.setPhase(nextPhase);
      }

      state.moveDriver(
        position,
        totalKm > 0 ? distanceRef.current / totalKm : 0,
        etaMinutes(remaining, SPEED_KMH),
        distanceToPickup,
      );
    }, SIMULATION.tickMs);

    return () => clearInterval(interval);
  }, [booking, driver, route, phase, totalKm, leg1Km]);

  return { phase: useRideStore((state) => state.phase) };
}

export type { TripPhase };
