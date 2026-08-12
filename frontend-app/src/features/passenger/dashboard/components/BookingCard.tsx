import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '@/components/cards/Card';
import { LocationInput, type PickedLocation } from '@/components/inputs/LocationInput';
import { Button } from '@/components/buttons/Button';
import { computeFare } from '@/utils/mock';
import { createGeoRoute } from '@/utils/geo';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/format';
import { useBookRide } from '@/features/passenger/booking/hooks/useBookRide';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { SavedPlace } from '@/types/passenger';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

interface BookingCardProps {
  userId: string;
  userName: string;
  userPhone: string;
  savedPlaces: SavedPlace[];
}

export function BookingCard({ userId, userName, userPhone, savedPlaces }: BookingCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<PassengerStackParamList>>();
  const bookRide = useBookRide();
  const [pickup, setPickup] = useState<PickedLocation | null>(null);
  const [dropoff, setDropoff] = useState<PickedLocation | null>(null);
  const [vehicle, setVehicle] = useState<'motorcycle'>('motorcycle');
  const [error, setError] = useState<string | null>(null);

  const pickupError = error && !pickup ? 'Please choose a pickup location' : undefined;
  const dropoffError = error && !dropoff ? 'Please choose a destination' : undefined;

  const estimate = pickup && dropoff ? createGeoRoute(pickup.coordinates, dropoff.coordinates) : null;
  const fare = pickup && dropoff ? computeFare(pickup.coordinates, dropoff.coordinates) : null;

  const handleBook = () => {
    if (!pickup || !dropoff) {
      setError('missing');
      return;
    }
    if (!estimate || !fare) return;

    bookRide.mutate(
      {
        passengerId: userId,
        passengerName: userName,
        passengerPhone: userPhone,
        pickup: pickup.name,
        pickupCoordinates: pickup.coordinates,
        dropoff: dropoff.name,
        dropoffCoordinates: dropoff.coordinates,
        distanceKm: Math.round(estimate.distanceKm * 10) / 10,
        durationMin: estimate.durationMin,
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
    <Card className="p-0">
      <View className="border-b border-line px-4 py-4">
        <Text className="text-[17px] font-bold text-ink">Book a ride</Text>
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

        {savedPlaces.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {savedPlaces.map(placeChip)}
          </View>
        )}

        <View>
          <Text className="mb-2.5 px-1 text-[14px] font-semibold text-ink">Vehicle type</Text>
          <Pressable
            onPress={() => setVehicle('motorcycle')}
            className={cn(
              'min-h-[60px] flex-row items-center gap-3 rounded-2xl border bg-white px-4',
              vehicle === 'motorcycle' ? 'border-primary bg-primary-soft' : 'border-line',
            )}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <MaterialCommunityIcons name="motorbike" size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">Motorcycle</Text>
              <Text className="mt-0.5 text-[12.5px] text-ink-muted">
                1 passenger · helmet provided · from {formatCurrency(40)}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={vehicle === 'motorcycle' ? 'radiobox-marked' : 'radiobox-blank'}
              size={20}
              color={vehicle === 'motorcycle' ? '#F97316' : '#CBD5E1'}
            />
          </Pressable>
        </View>

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

        {error && !pickup && !dropoff ? (
          <Text className="px-1 text-center text-[12.5px] text-danger">
            Choose a pickup location and a destination to continue
          </Text>
        ) : null}

        <Button
          label="Book now"
          size="lg"
          fullWidth
          loading={bookRide.isPending}
          onPress={handleBook}
          leftIcon={<MaterialCommunityIcons name="motorbike" size={18} color="#FFFFFF" />}
        />
      </View>
    </Card>
  );
}