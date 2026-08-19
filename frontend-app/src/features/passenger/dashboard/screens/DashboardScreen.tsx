import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { GreetingHeader } from '../components/GreetingHeader';
import { ServiceSelector } from '@/features/passenger/home/components/ServiceSelector';
import { PromoBanner } from '../components/PromoBanner';
import { Card } from '@/components/cards/Card';
import { StatCard } from '@/components/cards/StatCard';
import { Button } from '@/components/buttons/Button';
import { SkeletonCard } from '@/components/loaders/Skeleton';
import { usePassengerProfile } from '../hooks/usePassengerDashboard';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { useRideStore } from '@/store/ride-store';
import { formatCurrency, formatCurrencyShort } from '@/utils/format';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger, isLoading } = usePassengerProfile(user?.id ?? '');
  const ride = useRideStore((state) => state.booking);
  const ridePhase = useRideStore((state) => state.phase);
  const driver = useRideStore((state) => state.driver);
  const hasActiveRide =
    Boolean(ride) && !['completed', 'cancelled'].includes(ridePhase);

  if (isLoading || !passenger || !user) {
    return (
      <Screen scroll>
        <View className="w-full max-w-2xl self-center gap-5 px-4 pb-8 pt-4 sm:px-6 md:px-8">
          <GreetingHeader name={user?.name ?? 'Rider'} rating={0} />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View className="w-full max-w-2xl self-center gap-5 px-4 pb-8 pt-4 sm:px-6 md:px-8">
        <GreetingHeader name={passenger.name} rating={passenger.rating} verified={passenger.identityVerified} />

        {hasActiveRide && ride && driver ? (
          <Card variant="primary-soft">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
                <Feather name="navigation" size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-ink">Active ride to {ride.dropoff}</Text>
                <Text className="mt-0.5 text-[12px] text-ink-secondary">
                  {ridePhase === 'in-trip' ? 'Trip in progress' : 'Driver en route'} ·{' '}
                  {formatCurrency(ride.fare.total)}
                </Text>
              </View>
              <Button
                label="Track"
                size="sm"
                onPress={() => navigation.navigate('TripTracking', { booking: ride, driver })}
              />
            </View>
          </Card>
        ) : null}

        <View className="flex-row gap-3">
          <StatCard
            label="Total rides"
            value={String(passenger.totalBookings)}
            accent
            icon={<MaterialCommunityIcons name="motorbike" size={16} color="#C2410C" />}
          />
          <StatCard
            label="Total spent"
            value={formatCurrencyShort(passenger.totalSpent)}
            icon={<MaterialCommunityIcons name="wallet" size={16} color="#64748B" />}
          />
        </View>

        <ServiceSelector />

        <PromoBanner />
      </View>
    </Screen>
  );
}