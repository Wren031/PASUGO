import { useEffect, useRef, useState } from 'react';
import { groceryService } from '../services/grocery-service';
import { SIMULATION } from '@/constants/fare';
import { distancePerTick, etaMinutes, pointAlongRoute, remainingKm } from '@/utils/simulation';
import { buildRoute, routeDistanceKm } from '@/utils/geo';
import type { GroceryOrder } from '@/types/grocery';
import type { LatLng } from '@/types/map';

const SPEED_KMH = SIMULATION.averageSpeedKmh;

const WAIT_PREPARE_MS = 6000;
const WAIT_RIDER_MS = 9000;

export function useGroceryOrderSimulation(orderId: string, storeLocation: LatLng | null) {
  const [order, setOrder] = useState<GroceryOrder | null>(null);
  const [riderPosition, setRiderPosition] = useState<LatLng | null>(null);
  const distanceRef = useRef(0);
  const progressRef = useRef(0);
  const routeRef = useRef<LatLng[]>([]);
  const deliveredRef = useRef(false);

  useEffect(() => {
    groceryService.getGroceryOrderById(orderId).then(setOrder).catch(() => undefined);
  }, [orderId]);

  useEffect(() => {
    if (!storeLocation || !order?.deliveryCoordinates) return;
    routeRef.current = buildRoute(storeLocation, order.deliveryCoordinates, 10);
    setRiderPosition(storeLocation);
  }, [storeLocation, order?.deliveryCoordinates]);

  useEffect(() => {
    if (!order) return;

    if (order.status === 'Preparing') {
      const timer = setTimeout(() => {
        void groceryService.assignGroceryRider(orderId).then(setOrder);
      }, WAIT_PREPARE_MS);
      return () => clearTimeout(timer);
    }

    if (order.status === 'Rider Assigned') {
      const timer = setTimeout(() => {
        void groceryService
          .updateGroceryOrderStatus(orderId, 'On the Way', 'On the way to you', `Your rider is bringing your order to ${order.deliveryAddress}`)
          .then(setOrder);
      }, WAIT_RIDER_MS);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [order, orderId]);

  const totalKm = routeRef.current.length > 1 ? routeDistanceKm(routeRef.current) : 0;

  useEffect(() => {
    if (!order || order.status !== 'On the Way') return;
    if (totalKm === 0) return;

    const interval = setInterval(() => {
      distanceRef.current += distancePerTick(SPEED_KMH, SIMULATION.demoTimeScale, SIMULATION.tickMs);
      const route = routeRef.current;

      if (distanceRef.current >= totalKm) {
        if (!deliveredRef.current) {
          deliveredRef.current = true;
          setRiderPosition(route[route.length - 1]);
          progressRef.current = 1;
          void groceryService
            .updateGroceryOrderStatus(orderId, 'Delivered', 'Delivered', 'Thank you for ordering with HatodGo Grocery!')
            .then(setOrder);
        }
        return;
      }

      const position = pointAlongRoute(route, distanceRef.current);
      progressRef.current = distanceRef.current / totalKm;
      setRiderPosition(position);
    }, SIMULATION.tickMs);

    return () => clearInterval(interval);
  }, [order, orderId, totalKm]);

  const remainingKmNow = order?.status === 'On the Way' ? Math.max(0, totalKm - distanceRef.current) : 0;
  const etaMin = remainingKmNow > 0 ? etaMinutes(remainingKmNow, SPEED_KMH) : 0;

  return {
    order,
    riderPosition,
    route: routeRef.current,
    progress: progressRef.current,
    remainingKm: remainingKmNow,
    etaMin,
    delivered: deliveredRef.current || order?.status === 'Delivered',
  };
}