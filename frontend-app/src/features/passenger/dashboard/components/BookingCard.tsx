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
      className="flex-row items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2"
    >
      <MaterialCommunityIcons name={place.label === 'Home' ? 'home-variant' : 'briefcase'} size={13} color="#F97316" />
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
        <View className="gap-4">
          <LocationInput
            label="Pickup location"
            value={pickup?.name ?? null}
            placeholder="Choose pickup point"
            iconColor="#22C55E"
            error={pickupError}
            savedPlaces={savedPlaces}
            onSelect={setPickup}
          />
          <LocationInput
            label="Destination"
            value={dropoff?.name ?? null}
            placeholder="Where to?"
            iconColor="#EF4444"
            error={dropoffError}
            savedPlaces={savedPlaces}
            onSelect={setDropoff}
          />
          {savedPlaces.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {savedPlaces.map(placeChip)}
            </View>
          )}
        </View>

        <View>
          <Text className="mb-2.5 px-1 text-[14px] font-semibold text-ink">Vehicle type</Text>
          <Pressable
            onPress={() => setVehicle('motorcycle')}
            className={cn(
              'min-h-[56px] flex-row items-center gap-3 rounded-2xl border bg-white px-4',
              vehicle === 'motorcycle' ? 'border-primary bg-primary-soft' : 'border-line',
            )}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <MaterialCommunityIcons name="motorbike" size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">Motorcycle</Text>
              <Text className="mt-0.5 text-[12.5px] text-ink-muted">1 passenger · helmet provided</Text>
            </View>
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded-full border-2',
                vehicle === 'motorcycle' ? 'border-primary bg-primary' : 'border-line',
              )}
            >
              {vehicle === 'motorcycle' ? <View className="h-2 w-2 rounded-full bg-white" /> : null}
            </View>
          </Pressable>
        </View>

        {estimate && fare ? (
          <View className="gap-2.5 rounded-2xl bg-surface-muted p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[12.5px] font-medium text-ink-secondary">Distance</Text>
              <Text className="text-[14px] font-bold text-ink">{formatDistance(estimate.distanceKm)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-[12.5px] font-medium text-ink-secondary">Estimated time</Text>
              <Text className="text-[14px] font-bold text-ink">{formatDuration(estimate.durationMin)}</Text>
            </View>
            <View className="h-px bg-line" />
            <View className="flex-row items-center justify-between">
              <Text className="text-[14px] font-bold text-ink">Estimated fare</Text>
              <Text className="text-[18px] font-extrabold text-primary-dark">{formatCurrency(fare.total)}</Text>
            </View>
          </View>
        ) : null}

        <Button
          label="Book Now"
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
