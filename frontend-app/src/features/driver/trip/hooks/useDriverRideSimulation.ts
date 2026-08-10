import { useEffect, useRef } from 'react';
import { useDriverStore } from '@/store/driver-store';
import { useAddTripEarning } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { SIMULATION, FARE } from '@/constants/fare';
import { computeFare } from '@/utils/mock';
import { distancePerTick, etaMinutes, pointAlongRoute } from '@/utils/simulation';
import { routeDistanceKm } from '@/utils/geo';

const SPEED_KMH = SIMULATION.averageSpeedKmh;

export function useDriverRideSimulation() {
  const user = useAuthStore(selectUser);
  const online = useDriverStore((state) => state.online);
  const phase = useDriverStore((state) => state.phase);
  const activeRequest = useDriverStore((state) => state.activeRequest);
  const route = useDriverStore((state) => state.route);
  const addTrip = useAddTripEarning(user?.id ?? '');

  const distanceRef = useRef(0);
  const completedRef = useRef(false);

  const leg1EndIndex = activeRequest
    ? route.findIndex(
        (point) =>
          point.latitude === activeRequest.pickupCoordinates.latitude &&
          point.longitude === activeRequest.pickupCoordinates.longitude,
      )
    : -1;
  const leg1Km = leg1EndIndex > 0 ? routeDistanceKm(route.slice(0, leg1EndIndex + 1)) : 0;
  const totalKm = route.length > 1 ? routeDistanceKm(route) : 0;

  // Hold timer for "arrived at pickup" before starting the trip
  useEffect(() => {
    if (phase === 'arrived') {
      const timer = setTimeout(() => useDriverStore.getState().setPhase('on-trip'), SIMULATION.arrivingHoldMs);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase]);

  // Movement engine
  useEffect(() => {
    if (!online || !activeRequest || route.length < 2) return;
    if (phase === 'completed' || phase === 'idle') return;

    const interval = setInterval(() => {
      const state = useDriverStore.getState();
      const currentPhase = state.phase;
      if (currentPhase === 'completed' || currentPhase === 'idle') return;

      if (currentPhase === 'going-to-pickup' || currentPhase === 'on-trip') {
        distanceRef.current += distancePerTick(SPEED_KMH, SIMULATION.demoTimeScale, SIMULATION.tickMs);
      }

      const d = distanceRef.current;
      const request = state.activeRequest;
      if (!request) return;

      if (currentPhase === 'going-to-pickup') {
        if (d >= leg1Km) {
          state.setPhase('arrived');
          state.movePassenger(request.pickupCoordinates, 1, 0);
          return;
        }
        const position = pointAlongRoute(route, d);
        state.movePassenger(position, Math.max(0, d / leg1Km), etaMinutes(leg1Km - d, SPEED_KMH));
        return;
      }

      if (currentPhase === 'on-trip') {
        if (d >= totalKm) {
          if (!completedRef.current) {
            completedRef.current = true;
            const fare = computeFare(request.pickupCoordinates, request.dropoffCoordinates);
            const commission = Math.round(fare.total * (FARE.driverCommissionPercent / 100));
            const earning = {
              bookingId: request.bookingId,
              driverId: user?.id ?? '',
              pickup: request.pickup,
              dropoff: request.dropoff,
              date: new Date().toISOString(),
              passengerName: request.passengerName,
              distanceKm: Math.round((totalKm - leg1Km) * 10) / 10,
              fare: fare.total,
              commission,
              net: fare.total - commission,
              bonus: 0,
              rating: 0,
              paymentMethod: request.paymentMethod,
            };
            state.movePassenger(request.dropoffCoordinates, 1, 0);
            addTrip.mutate(earning, {
              onSuccess: (saved) => state.completeTrip(saved),
            });
          }
          return;
        }
        const position = pointAlongRoute(route, d);
        const travelled = Math.max(0, d - leg1Km);
        const leg2Km = totalKm - leg1Km;
        state.movePassenger(position, leg2Km > 0 ? travelled / leg2Km : 1, etaMinutes(totalKm - d, SPEED_KMH));
      }
    }, SIMULATION.tickMs);

    return () => clearInterval(interval);
  }, [online, activeRequest, route, phase, leg1Km, totalKm, addTrip]);
}
