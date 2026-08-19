import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/buttons/Button';
import { RiderSelectCard } from '../components/RiderSelectCard';
import { useNearbyDrivers, useAssignDriver, useCancelBooking } from '../hooks/useBookRide';
import { useRideStore } from '@/store/ride-store';
import { showToast } from '@/store/toast-store';
import { formatCurrency, formatDuration } from '@/utils/format';
import type { AvailableDriver } from '@/types/booking';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Route = RouteProp<PassengerStackParamList, 'PickRider'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function PickRiderScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking } = route.params;
  const assignDriver = useAssignDriver();
  const cancelBooking = useCancelBooking();

  const { data: nearbyDrivers, isLoading } = useNearbyDrivers(
    booking.pickupCoordinates,
    booking.vehicleType,
  );
  const selecting = useRef(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const isCar = booking.vehicleType === 'car';

  const handleSelect = (driver: AvailableDriver) => {
    if (selecting.current) return;
    selecting.current = true;
    setSelectingId(driver.id);
    assignDriver.mutate(
      { bookingId: booking.id, driverId: driver.id },
      {
        onSuccess: (updatedBooking) => {
          navigation.replace('DriverFound', { booking: updatedBooking, driver });
        },
        onError: (err: Error) => {
          selecting.current = false;
          setSelectingId(null);
          showToast('error', 'Rider unavailable', err.message);
        },
      },
    );
  };

  const handleCancel = () => {
    cancelBooking.mutate(
      { id: booking.id, reason: 'Cancelled by passenger' },
      {
        onSuccess: () => {
          useRideStore.getState().reset();
          showToast('info', 'Booking cancelled');
          navigation.popToTop();
        },
        onError: () => navigation.popToTop(),
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader
        title={isCar ? 'Available Car Riders' : 'Available Motorcycle Riders'}
        subtitle="Choose who picks you up"
      />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Card className="mb-4 p-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-success" />
                <Text className="flex-1 text-[12.5px] font-semibold text-ink">{booking.pickup}</Text>
              </View>
              <View className="ml-[3px] my-1 h-3 w-px border-l border-dashed border-line" />
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-danger" />
                <Text className="flex-1 text-[12.5px] font-semibold text-ink">{booking.dropoff}</Text>
              </View>
            </View>
            <View className="items-end gap-1.5">
              <Text className="text-[17px] font-extrabold text-primary-dark">
                {formatCurrency(booking.fare.total)}
              </Text>
              <Badge
                label={`${formatDuration(booking.durationMin)} · ${isCar ? 'Car' : 'Motorcycle'}`}
                tone={isCar ? 'info' : 'primary'}
              />
            </View>
          </View>
        </Card>

        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="mt-3 text-[13px] text-ink-muted">Looking for nearby riders…</Text>
          </View>
        ) : nearbyDrivers && nearbyDrivers.length > 0 ? (
          <View className="gap-3">
            {nearbyDrivers.map((driver) => (
              <RiderSelectCard
                key={driver.id}
                driver={driver}
                fareTotal={booking.fare.total}
                selecting={selectingId === driver.id}
                onSelect={() => handleSelect(driver)}
                onPress={() =>
                  navigation.navigate('RiderProfile', { driverId: driver.id, booking, driver })
                }
              />
            ))}
          </View>
        ) : (
          <View className="items-center gap-2 rounded-2xl border border-dashed border-line bg-white px-6 py-10">
            <MaterialCommunityIcons
              name={isCar ? 'car-off' : 'motorbike-off'}
              size={36}
              color="#CBD5E1"
            />
            <Text className="text-[14px] font-bold text-ink">No riders available right now</Text>
            <Text className="text-center text-[12.5px] leading-5 text-ink-muted">
              Nearby {isCar ? 'car' : 'motorcycle'} riders are busy. Try again in a few minutes or
              book automatically.
            </Text>
          </View>
        )}

        {!isLoading && nearbyDrivers && nearbyDrivers.length > 0 ? (
          <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-surface-muted px-4 py-3">
            <Feather name="refresh-cw" size={14} color="#64748B" />
            <Text className="flex-1 text-[12px] text-ink-secondary">
              Rider list refreshes automatically. A rider who accepts another booking disappears
              from this list.
            </Text>
          </View>
        ) : null}

        <Button
          label="Cancel booking"
          variant="outline"
          fullWidth
          className="mt-5"
          onPress={handleCancel}
          loading={cancelBooking.isPending}
        />
      </ScrollView>
    </Screen>
  );
}