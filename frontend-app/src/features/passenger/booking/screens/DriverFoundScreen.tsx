import { useState } from 'react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/buttons/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useCancelBooking } from '../hooks/useBookRide';
import { useRideStore } from '@/store/ride-store';
import { showToast } from '@/store/toast-store';
import { combineRoutes, buildRoute, createGeoRoute } from '@/utils/geo';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/format';
import type { PassengerStackParamList } from '@/navigation/types';

type Route = RouteProp<PassengerStackParamList, 'DriverFound'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function DriverFoundScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking, driver } = route.params;
  const cancelBooking = useCancelBooking();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleContact = () => {
    showToast('info', `Calling ${driver.name}…`, 'Simulated call - the rider will be contacted shortly.');
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

  const handleStartTrip = () => {
    const legToPickup = buildRoute(driver.coordinates, booking.pickupCoordinates);
    const legToDropoff = buildRoute(booking.pickupCoordinates, booking.dropoffCoordinates);
    const routePoints = combineRoutes([legToPickup, legToDropoff]);
    const pickupRoute = createGeoRoute(driver.coordinates, booking.pickupCoordinates);
    useRideStore.getState().startRide(booking, driver, routePoints);
    useRideStore.getState().setPhase('accepted');
    useRideStore
      .getState()
      .moveDriver(driver.coordinates, 0, pickupRoute.durationMin, driver.distanceKm);
    navigation.replace('TripTracking', { booking, driver });
  };

  return (
    <Screen>
      <ScreenHeader title="Driver found" />
      <View className="flex-1 px-4 pb-6">
        <Card className="p-5">
          <View className="items-center">
            <Avatar name={driver.name} size="xl" showOnlineDot />
            <Text className="mt-3 text-[20px] font-extrabold text-ink">{driver.name}</Text>
            <RatingStars value={driver.rating} size={15} showValue />
            <Text className="mt-1 text-[12px] text-ink-muted">{driver.trips.toLocaleString()} completed rides</Text>
          </View>

          <View className="mt-5 flex-row gap-2">
            <Badge
              label={`${driver.vehicleType === 'car' ? 'Car' : 'Motorcycle'} · ${driver.vehicleLabel}`}
              tone="neutral"
            />
            <Badge label={driver.plateNumber} tone="primary" />
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate('RiderProfile', { driverId: driver.id, booking, driver })
            }
            className="mt-4 flex-row items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 active:bg-slate-50"
          >
            <View className="flex-row items-center gap-2.5">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <Feather name="user" size={14} color="#F97316" />
              </View>
              <Text className="text-[13px] font-bold text-ink">View rider account</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </Pressable>

          <View className="mt-4 rounded-2xl bg-surface-muted p-4">
            <View className="flex-row items-center gap-2.5">
              <View className="h-2.5 w-2.5 rounded-full bg-success" />
              <Text className="flex-1 text-[13px] font-semibold text-ink">{booking.pickup}</Text>
            </View>
            <View className="ml-[4px] my-1 h-4 w-px border-l border-dashed border-line" />
            <View className="flex-row items-center gap-2.5">
              <View className="h-2.5 w-2.5 rounded-full bg-danger" />
              <Text className="flex-1 text-[13px] font-semibold text-ink">{booking.dropoff}</Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            <View className="flex-1">
              <Text className="text-[11px] text-ink-muted">Distance</Text>
              <Text className="text-[14px] font-bold text-ink">{formatDistance(booking.distanceKm)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-ink-muted">ETA</Text>
              <Text className="text-[14px] font-bold text-ink">{formatDuration(driver.etaMin)} away</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-[11px] text-ink-muted">Estimated fare</Text>
              <Text className="text-[14px] font-extrabold text-primary-dark">{formatCurrency(booking.fare.total)}</Text>
            </View>
          </View>
        </Card>

        <View className="flex-1" />

        <View className="gap-3">
          <Button label="Start trip" size="lg" fullWidth onPress={handleStartTrip} />
          <View className="flex-row gap-3">
            <Button
              label="Contact driver"
              variant="outline"
              className="flex-1"
              onPress={handleContact}
              leftIcon={<Feather name="phone" size={16} color="#0F172A" />}
            />
            <Button
              label="Cancel ride"
              variant="danger"
              className="flex-1"
              onPress={() => setConfirmOpen(true)}
            />
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={confirmOpen}
        title="Cancel this ride?"
        message={`${driver.name} is already on the way. Cancelling may apply a small fee.`}
        confirmLabel="Cancel ride"
        tone="danger"
        loading={cancelBooking.isPending}
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </Screen>
  );
}
