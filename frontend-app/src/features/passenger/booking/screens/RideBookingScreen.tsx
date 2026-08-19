import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
import type { BookingMethod, VehicleType } from '@/types/booking';
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

const methodOptions: {
  method: BookingMethod;
  title: string;
  description: string;
  icon: 'zap' | 'users';
  color: string;
}[] = [
  {
    method: 'automatic',
    title: 'Automatic Find Rider',
    description: 'HatodGo finds the nearest available rider for you',
    icon: 'zap',
    color: '#F97316',
  },
  {
    method: 'manual',
    title: 'Customize / Pick a Rider',
    description: 'Browse nearby riders and choose who picks you up',
    icon: 'users',
    color: '#3B82F6',
  },
];

const steps: { label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { label: 'Vehicle', icon: 'navigation' },
  { label: 'Method', icon: 'settings' },
  { label: 'Trip', icon: 'map-pin' },
];

export function RideBookingScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger } = usePassengerProfile(user?.id ?? '');
  const bookRide = useBookRide();

  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [method, setMethod] = useState<BookingMethod | null>(null);
  const [pickup, setPickup] = useState<PickedLocation | null>(null);
  const [dropoff, setDropoff] = useState<PickedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const savedPlaces: SavedPlace[] = passenger?.savedPlaces ?? [];

  const pickupError = error === 'missing' && !pickup ? 'Please choose a pickup location' : undefined;
  const dropoffError = error === 'missing' && !dropoff ? 'Please choose a destination' : undefined;
  const vehicleError = error === 'vehicle' ? 'Please choose a vehicle type' : undefined;
  const methodError = error === 'method' ? 'Please choose a booking method' : undefined;

  const estimate = pickup && dropoff ? createGeoRoute(pickup.coordinates, dropoff.coordinates) : null;
  const fare = pickup && dropoff ? computeFare(pickup.coordinates, dropoff.coordinates, vehicle ?? 'motorcycle') : null;

  const handleNext = () => {
    if (step === 0 && !vehicle) {
      setError('vehicle');
      return;
    }
    if (step === 1 && !method) {
      setError('method');
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleBook = () => {
    if (passenger && !passenger.identityVerified) {
      showToast('error', 'Account not verified', 'Please verify your account to book a rider.');
      navigation.navigate('VerifyAccount', { next: 'RideBooking' });
      return;
    }
    if (!pickup || !dropoff) {
      setError('missing');
      return;
    }
    if (!estimate || !fare || !user || !vehicle || !method) return;

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
        method,
      },
      {
        onSuccess: (booking) => {
          if (method === 'manual') {
            navigation.navigate('PickRider', { booking });
            return;
          }
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

  const renderVehicleStep = () => (
    <View>
      <Text className="mb-1 px-1 text-[16px] font-bold text-ink">Choose your vehicle</Text>
      <Text className="mb-3.5 px-1 text-[12.5px] text-ink-muted">
        Select the vehicle type for your trip
      </Text>
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
        <Text className="mt-2 px-1 text-[12.5px] text-danger">{vehicleError}</Text>
      ) : null}
    </View>
  );

  const renderMethodStep = () => (
    <View>
      <Text className="mb-1 px-1 text-[16px] font-bold text-ink">Booking method</Text>
      <Text className="mb-3.5 px-1 text-[12.5px] text-ink-muted">
        How would you like to find your rider?
      </Text>
      <View className="gap-3">
        {methodOptions.map((option) => {
          const selected = method === option.method;
          return (
            <Pressable
              key={option.method}
              onPress={() => {
                setError(null);
                setMethod(option.method);
              }}
              className={cn(
                'min-h-[64px] flex-row items-center gap-3 rounded-2xl border bg-white px-4',
                selected ? 'border-primary bg-primary-soft' : 'border-line',
              )}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: selected ? option.color : '#F1F5F9' }}
              >
                <Feather name={option.icon} size={18} color={selected ? '#FFFFFF' : '#94A3B8'} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">{option.title}</Text>
                <Text className="mt-0.5 text-[12.5px] text-ink-muted">{option.description}</Text>
              </View>
              <MaterialCommunityIcons
                name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                size={20}
                color={selected ? option.color : '#CBD5E1'}
              />
            </Pressable>
          );
        })}
      </View>
      {methodError ? (
        <Text className="mt-2 px-1 text-[12.5px] text-danger">{methodError}</Text>
      ) : null}
    </View>
  );

  const renderTripStep = () => (
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

        {error === 'missing' ? (
          <Text className="px-1 text-center text-[12.5px] text-danger">
            Choose a pickup location and destination to continue
          </Text>
        ) : null}
      </View>
    </Card>
  );

  const isLastStep = step === steps.length - 1;

  return (
    <Screen>
      <ScreenHeader title="Book a Rider" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 px-1 pt-1">
          {steps.map((s, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <React.Fragment key={s.label}>
                {index > 0 ? (
                  <View
                    className={cn(
                      'h-px flex-1',
                      index <= step ? 'bg-primary' : 'bg-line',
                    )}
                  />
                ) : null}
                <View
                  className={cn(
                    'flex-row items-center gap-1.5 rounded-full border px-3 py-1.5',
                    active
                      ? 'border-primary bg-primary-soft'
                      : done
                        ? 'border-success/40 bg-success-soft'
                        : 'border-line bg-white',
                  )}
                >
                  <View
                    className={cn(
                      'h-5 w-5 items-center justify-center rounded-full',
                      done ? 'bg-success' : active ? 'bg-primary' : 'bg-surface-alt',
                    )}
                  >
                    {done ? (
                      <Feather name="check" size={10} color="#FFFFFF" />
                    ) : (
                      <Feather
                        name={s.icon}
                        size={9}
                        color={active ? '#FFFFFF' : '#94A3B8'}
                      />
                    )}
                  </View>
                  <Text
                    className={cn(
                      'text-[11px] font-bold',
                      active
                        ? 'text-primary-dark'
                        : done
                          ? 'text-success'
                          : 'text-ink-muted',
                    )}
                  >
                    {s.label}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        <View className="mt-6">
          {step === 0 ? renderVehicleStep() : null}
          {step === 1 ? renderMethodStep() : null}
          {step === 2 ? renderTripStep() : null}
        </View>

        <View className="mt-7 flex-row gap-3">
          {step > 0 ? (
            <Button
              label="Back"
              variant="outline"
              size="lg"
              className="flex-1"
              onPress={handleBack}
              leftIcon={<Feather name="arrow-left" size={16} color="#F97316" />}
            />
          ) : null}
          {!isLastStep ? (
            <Button
              label="Continue"
              size="lg"
              fullWidth={step === 0}
              className={step > 0 ? 'flex-[2]' : undefined}
              onPress={handleNext}
              rightIcon={<Feather name="arrow-right" size={16} color="#FFFFFF" />}
            />
          ) : (
            <Button
              label="Book now"
              size="lg"
              className="flex-[2]"
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
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
