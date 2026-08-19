import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { LocationInput, type PickedLocation } from '@/components/inputs/LocationInput';
import { Button } from '@/components/buttons/Button';
import { computeFare } from '@/utils/mock';
import { createGeoRoute } from '@/utils/geo';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/format';
import { useBookRide } from '@/features/passenger/booking/hooks/useBookRide';
import { usePassengerProfile } from '@/features/passenger/dashboard/hooks/usePassengerDashboard';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { SavedPlace } from '@/types/passenger';
import type { VehicleType } from '@/types/booking';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const vehicleOptions: {
  type: VehicleType;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: 'orange' | 'blue';
  from: string;
}[] = [
  {
    type: 'motorcycle',
    title: 'Motorcycle',
    description: '1 passenger · helmet provided',
    icon: 'motorbike',
    accent: 'orange',
    from: 'from ₱40',
  },
  {
    type: 'car',
    title: 'Car',
    description: 'Up to 4 passengers · air-conditioned',
    icon: 'car',
    accent: 'blue',
    from: 'from ₱70',
  },
];

export function RideBookingScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger } = usePassengerProfile(user?.id ?? '');
  const bookRide = useBookRide();

  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [pickup, setPickup] = useState<PickedLocation | null>(null);
  const [dropoff, setDropoff] = useState<PickedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const savedPlaces: SavedPlace[] = passenger?.savedPlaces ?? [];

  const pickupError = error && !pickup ? 'Please choose a pickup location' : undefined;
  const dropoffError = error && !dropoff ? 'Please choose a destination' : undefined;
  const vehicleError = error && !vehicle ? 'Please choose a vehicle type' : undefined;

  const estimate = pickup && dropoff ? createGeoRoute(pickup.coordinates, dropoff.coordinates) : null;
  const fare = pickup && dropoff ? computeFare(pickup.coordinates, dropoff.coordinates, vehicle ?? 'motorcycle') : null;

  const handleBook = () => {
    if (!vehicle) {
      setError('vehicle');
      return;
    }
    if (!pickup || !dropoff) {
      setError('missing');
      return;
    }
    if (!estimate || !fare || !user) return;

    bookRide.mutate(
      {
        passengerId: user.id,
        passengerName: user.name ?? passenger?.name ?? 'Passenger',
        passengerPhone: user.phone ?? passenger?.phone ?? '',
        pickup: pickup.name,
        pickupCoordinates: pickup.coordinates,
        dropoff: dropoff.name,
        dropoffCoordinates: dropoff.coordinates,
        distanceKm: Math.round(estimate.distanceKm * 10) / 10,
        durationMin: estimate.durationMin,
        vehicleType: vehicle,
        paymentMethod: 'Cash',
        fare,
      },
      {
        onSuccess: (booking) => {
          navigation.navigate('SearchDriver', { booking });
        },
        onError: (err: Error) => {
          showToast('error', 'Booking failed', err.message);
        },
      },
    );
  };

  const handleSwap = () => {
    setError(null);
    setPickup(dropoff);
    setDropoff(pickup);
  };

  const placeChip = (place: SavedPlace) => (
    <Pressable
      key={place.id}
      onPress={() => {
        setError(null);
        if (!pickup) {
          setPickup(place);
          return;
        }
        if (dropoff?.id === place.id) return;
        if (!dropoff) setDropoff(place);
      }}
      className="flex-row items-center gap-1.5 rounded-full border border-line bg-surface-muted px-3.5 py-2 active:bg-surface-alt"
    >
      <MaterialCommunityIcons
        name={place.label === 'Home' ? 'home-variant' : 'briefcase'}
        size={13}
        color="#F97316"
      />
      <Text className="text-[12px] font-semibold text-ink-secondary">{place.name}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <ScreenHeader title="Book a Rider" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View>
            <Text className="mb-2.5 px-1 text-[14px] font-semibold text-ink">Choose your vehicle</Text>
            <View className="gap-3">
              {vehicleOptions.map((option) => {
                const selected = vehicle === option.type;
                const activeStyles =
                  option.accent === 'orange'
                    ? { border: 'border-primary', bg: 'bg-primary-soft' }
                    : { border: 'border-blue-500', bg: 'bg-blue-50' };
                const iconBg =
                  option.accent === 'orange' ? 'bg-primary' : 'bg-blue-500';
                return (
                  <Pressable
                    key={option.type}
                    onPress={() => {
                      setError(null);
                      setVehicle(option.type);
                    }}
                    className={cn(
                      'min-h-[64px] flex-row items-center gap-3 rounded-2xl border bg-white px-4',
                      selected ? activeStyles.border : 'border-line',
                      selected && activeStyles.bg,
                    )}
                  >
                    <View className={cn('h-10 w-10 items-center justify-center rounded-full', iconBg)}>
                      <MaterialCommunityIcons name={option.icon} size={20} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[15px] font-bold text-ink">{option.title}</Text>
                      <Text className="mt-0.5 text-[12.5px] text-ink-muted">
                        {option.description} · {option.from}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                      size={20}
                      color={selected ? (option.accent === 'orange' ? '#F97316' : '#3B82F6') : '#CBD5E1'}
                    />
                  </Pressable>
                );
              })}
            </View>
            {vehicleError ? (
              <Text className="mt-1.5 px-1 text-[12.5px] text-danger">{vehicleError}</Text>
            ) : null}
          </View>

          <Card className="p-0">
            <View className="border-b border-line px-4 py-4">
              <Text className="text-[17px] font-bold text-ink">Trip details</Text>
              <Text className="mt-0.5 text-[13px] text-ink-muted">Choose your pickup and destination</Text>
            </View>

            <View className="gap-5 p-4">
              <View className="relative">
                <View className="rounded-2xl border border-line bg-white p-3">
                  <View className="flex-row">
                    <View className="w-5 items-center py-1.5">
                      <View className="h-2.5 w-2.5 rounded-full bg-success" />
                      <View className="my-1.5 w-px flex-1 border-l border-dashed border-line-strong" />
                      <View className="h-2.5 w-2.5 rounded-full bg-danger" />
                    </View>
                    <View className="ml-1 flex-1 gap-3">
                      <LocationInput
                        bare
                        value={pickup?.name ?? null}
                        placeholder="Pickup point"
                        iconColor="#22C55E"
                        error={pickupError}
                        savedPlaces={savedPlaces}
                        target="pickup"
                        onSelect={setPickup}
                      />
                      <LocationInput
                        bare
                        value={dropoff?.name ?? null}
                        placeholder="Where to?"
                        iconColor="#EF4444"
                        error={dropoffError}
                        savedPlaces={savedPlaces}
                        target="dropoff"
                        onSelect={setDropoff}
                      />
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleSwap}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Swap pickup and destination"
                  className="absolute right-4 top-1/2 z-10 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white"
                >
                  <MaterialCommunityIcons name="swap-vertical" size={18} color="#475569" />
                </Pressable>
              </View>

              {savedPlaces.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">{savedPlaces.map(placeChip)}</View>
              ) : null}

              {estimate && fare ? (
                <View className="gap-2.5 rounded-2xl border border-line bg-surface-muted p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="map-marker-distance" size={15} color="#94A3B8" />
                      <Text className="text-[12.5px] font-medium text-ink-secondary">Distance</Text>
                    </View>
                    <Text className="text-[14px] font-bold text-ink">{formatDistance(estimate.distanceKm)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="clock-outline" size={15} color="#94A3B8" />
                      <Text className="text-[12.5px] font-medium text-ink-secondary">Estimated time</Text>
                    </View>
                    <Text className="text-[14px] font-bold text-ink">{formatDuration(estimate.durationMin)}</Text>
                  </View>
                  <View className="h-px bg-line" />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="cash" size={15} color="#94A3B8" />
                      <Text className="text-[14px] font-bold text-ink">Estimated fare</Text>
                    </View>
                    <Text className="text-[20px] font-extrabold text-primary-dark">{formatCurrency(fare.total)}</Text>
                  </View>
                </View>
              ) : null}

              {error && !vehicle && !pickup && !dropoff ? (
                <Text className="px-1 text-center text-[12.5px] text-danger">
                  Choose a vehicle, pickup location, and destination to continue
                </Text>
              ) : null}

              <Button
                label="Book now"
                size="lg"
                fullWidth
                loading={bookRide.isPending}
                onPress={handleBook}
                leftIcon={
                  <MaterialCommunityIcons
                    name={vehicle === 'car' ? 'car' : 'motorbike'}
                    size={18}
                    color="#FFFFFF"
                  />
                }
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}