import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/screen/Screen';
import { MapContainer } from '@/components/maps/MapContainer';
import { TripStatusStepper } from '@/components/tracking/TripStatusStepper';
import { RideStatusCard } from '../components/RideStatusCard';
import { usePassengerRideSimulation } from '../hooks/usePassengerRideSimulation';
import { useCancelBooking } from '@/features/passenger/booking/hooks/useBookRide';
import { useRideStore } from '@/store/ride-store';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { showToast } from '@/store/toast-store';
import type { PassengerStackParamList } from '@/navigation/types';

type Route = RouteProp<PassengerStackParamList, 'TripTracking'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const STEPS = [
  { key: 'accepted', label: 'Accepted', icon: 'account-check-outline' as const },
  { key: 'arriving', label: 'Arriving', icon: 'map-marker-radius-outline' as const },
  { key: 'picked-up', label: 'Picked up', icon: 'bicycle' as const },
  { key: 'in-trip', label: 'In trip', icon: 'road-variant' as const },
  { key: 'done', label: 'Done', icon: 'check-circle-outline' as const },
];

const phaseIndex: Record<string, number> = {
  accepted: 0,
  arriving: 1,
  'picked-up': 2,
  'in-trip': 3,
  completed: 4,
  cancelled: 0,
};

export function TripTrackingScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking, driver } = route.params;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const phase = useRideStore((state) => state.phase);
  const driverPosition = useRideStore((state) => state.driverPosition);
  const tripRoute = useRideStore((state) => state.route);
  const etaMin = useRideStore((state) => state.etaMin);
  const distanceToPickupKm = useRideStore((state) => state.distanceToPickupKm);

  usePassengerRideSimulation();

  const cancelBooking = useCancelBooking();

  const markers = useMemo(
    () => [
      { id: 'pickup', type: 'pickup' as const, coordinate: booking.pickupCoordinates, label: booking.pickup },
      { id: 'dropoff', type: 'dropoff' as const, coordinate: booking.dropoffCoordinates, label: booking.dropoff },
      ...(driverPosition
        ? [{ id: 'driver', type: 'driver' as const, coordinate: driverPosition }]
        : []),
    ],
    [driverPosition, booking],
  );

  const handleCancel = () => {
    cancelBooking.mutate(
      { id: booking.id, reason: 'Cancelled by passenger' },
      {
        onSuccess: () => {
          useRideStore.getState().cancelRide('Cancelled by passenger');
          showToast('info', 'Ride cancelled');
          navigation.popToTop();
        },
      },
    );
  };

  const handleContact = () => {
    showToast('info', `Calling ${driver.name}…`);
  };

  const handleDone = () => {
    useRideStore.getState().reset();
    navigation.popToTop();
  };

  const handleRate = () => {
    navigation.replace('ReviewDriver', { booking });
  };

  return (
    <Screen>
      <View className="flex-1">
        <View className="h-[42%] px-4 pt-3">
          <View className="flex-1">
            <MapContainer
              route={tripRoute}
              markers={markers}
              className="h-full w-full"
            />
          </View>
        </View>

        <View className="bg-white px-5 pt-4">
          <Text className="mb-3 text-center text-[13px] font-bold uppercase tracking-wide text-ink-muted">
            {phase === 'completed' ? 'Trip summary' : 'Live trip'}
          </Text>
          <TripStatusStepper steps={STEPS} currentIndex={phaseIndex[phase] ?? 0} className="pb-1" />
        </View>

        <View className="flex-1">
          <RideStatusCard
            booking={booking}
            driver={driver}
            phase={phase}
            etaMin={etaMin}
            distanceToPickupKm={distanceToPickupKm}
            onContact={handleContact}
            onCancel={() => setConfirmOpen(true)}
            onRate={handleRate}
            onDone={handleDone}
          />
        </View>
      </View>

      <ConfirmDialog
        visible={confirmOpen}
        title="Cancel this ride?"
        message={`${driver.name} is on the way. Do you want to cancel?`}
        confirmLabel="Cancel ride"
        tone="danger"
        loading={cancelBooking.isPending}
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </Screen>
  );
}
