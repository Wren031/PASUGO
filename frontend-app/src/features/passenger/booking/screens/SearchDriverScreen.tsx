import { useEffect, useRef } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { SearchingAnimation } from '../components/SearchingAnimation';
import { NearbyDriversList } from '../components/NearbyDriversList';
import { SkeletonCard } from '@/components/loaders/Skeleton';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useNearbyDrivers, useCancelBooking } from '../hooks/useBookRide';
import { useRideStore } from '@/store/ride-store';
import { showToast } from '@/store/toast-store';
import { formatCurrency } from '@/utils/format';
import type { AvailableDriver } from '@/types/booking';
import type { PassengerStackParamList } from '@/navigation/types';

type Route = RouteProp<PassengerStackParamList, 'SearchDriver'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function SearchDriverScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking } = route.params;
  const cancelBooking = useCancelBooking();

  const { data: nearbyDrivers, isLoading } = useNearbyDrivers(booking.pickupCoordinates, booking.vehicleType);
  const matched = useRef(false);

  const assignDriver = (driver: AvailableDriver) => {
    if (matched.current) return;
    matched.current = true;
    navigation.replace('DriverFound', { booking, driver });
  };

  useEffect(() => {
    if (!nearbyDrivers || nearbyDrivers.length === 0) return;
    const timer = setTimeout(() => assignDriver(nearbyDrivers[0]), 3500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearbyDrivers]);

  const handleCancel = () => {
    cancelBooking.mutate(
      { id: booking.id, reason: 'Cancelled by passenger' },
      {
        onSuccess: () => {
          useRideStore.getState().reset();
          showToast('info', 'Booking cancelled');
          navigation.goBack();
        },
        onError: () => navigation.goBack(),
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Finding your rider" />
      <View className="flex-1 px-4 pb-6">
        <SearchingAnimation />

        <Card className="mb-5 flex-row items-center justify-between p-3.5">
          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-ink">{booking.pickup}</Text>
            <Text className="my-1 text-[11px] text-ink-muted">→</Text>
            <Text className="text-[13px] font-semibold text-ink">{booking.dropoff}</Text>
          </View>
          <Text className="text-lg font-extrabold text-primary-dark">{formatCurrency(booking.fare.total)}</Text>
        </Card>

        <Text className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Nearby riders
        </Text>

        {isLoading ? (
          <SkeletonCard />
        ) : nearbyDrivers && nearbyDrivers.length > 0 ? (
          <NearbyDriversList drivers={nearbyDrivers} onSelect={assignDriver} />
        ) : (
          <Text className="py-6 text-center text-[13px] text-ink-muted">
            No drivers available nearby. Retrying…
          </Text>
        )}

        <View className="flex-1" />
        <Button
          label="Cancel booking"
          variant="outline"
          fullWidth
          onPress={handleCancel}
          loading={cancelBooking.isPending}
        />
      </View>
    </Screen>
  );
}
