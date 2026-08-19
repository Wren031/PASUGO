import React from 'react';
import { Text, View, Pressable } from 'react-native';
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
import { useWallet } from '@/features/passenger/payments/hooks/usePayments';
import { WalletCard } from '@/components/cards/WalletCard';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { useRideStore } from '@/store/ride-store';
import { formatCurrency, formatCurrencyShort } from '@/utils/format';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function DashboardScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger, isLoading, refetch } = usePassengerProfile(user?.id ?? '');
  const { data: wallet } = useWallet(user?.id ?? '');

  const ride = useRideStore((state) => state.booking);
  const ridePhase = useRideStore((state) => state.phase);
  const driver = useRideStore((state) => state.driver);

  const hasActiveRide =
    Boolean(ride) && !['completed', 'cancelled'].includes(ridePhase);

  /* -------------------------------------------------------------------------- */
  /*                            Loading State UI                                */
  /* -------------------------------------------------------------------------- */
  if (isLoading || !user) {
    return (
      <Screen scroll bgClassName="bg-slate-50">
        <View className="w-full max-w-2xl self-center gap-6 px-4 pb-28 pt-4 sm:px-6 md:px-8">
          <GreetingHeader name={user?.name ?? 'Rider'} rating={0} />
          <SkeletonCard />
          <SkeletonCard />
          <View className="flex-row gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </View>
        </View>
      </Screen>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            Error / Offline UI                              */
  /* -------------------------------------------------------------------------- */
  if (!passenger) {
    return (
      <Screen scroll bgClassName="bg-slate-50">
        <View className="w-full max-w-2xl self-center gap-6 px-4 pb-28 pt-4 sm:px-6 md:px-8">
          <GreetingHeader name={user.name ?? 'Rider'} rating={0} />

          <Card className="items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50/60 p-6 text-center">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
              <Feather name="wifi-off" size={20} color="#EF4444" />
            </View>
            <View className="items-center gap-1">
              <Text className="text-base font-bold text-slate-900">
                Unable to load dashboard
              </Text>
              <Text className="max-w-xs text-center text-xs font-medium text-slate-500">
                Please check your internet connection and tap below to retry.
              </Text>
            </View>
            <Button
              label="Try Again"
              variant="outline"
              size="sm"
              onPress={() => void refetch()}
              leftIcon={<Feather name="refresh-cw" size={14} color="#0F172A" />}
              className="mt-1 border-slate-300 bg-white active:bg-slate-100"
            />
          </Card>

          <ServiceSelector />
          <PromoBanner />
        </View>
      </Screen>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            Main Dashboard UI                               */
  /* -------------------------------------------------------------------------- */
  return (
    <Screen scroll bgClassName="bg-slate-50">
      <View className="w-full max-w-2xl self-center gap-6 px-4 pb-28 pt-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <GreetingHeader
          name={passenger.name}
          rating={passenger.rating}
          verified={passenger.identityVerified}
        />

        {/* Primary Wallet / Credit Card View */}
        <WalletCard
          balance={wallet?.balance ?? 0}
          subtitle="Available Balance"
          suffix={`HAT • ${(user?.id ?? '').slice(-4).toUpperCase()}`}
          actionLabel="Top Up"
          onPress={() => navigation.navigate('Payments')}
          onAction={() => navigation.navigate('Payments')}
        />

        {/* Live Active Ride Card */}
        {hasActiveRide && ride && driver ? (
          <Pressable
            onPress={() =>
              navigation.navigate('TripTracking', { booking: ride, driver })
            }
            className="rounded-3xl border border-orange-200 bg-orange-50/80 p-4 active:bg-orange-100/70"
          >
            <View className="flex-row items-center gap-3.5">
              {/* Active Status Badge Icon */}
              <View className="relative h-12 w-12 items-center justify-center rounded-2xl bg-orange-500">
                <Feather name="navigation" size={20} color="#FFFFFF" />
                <View className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-orange-50 bg-emerald-500" />
              </View>

              {/* Ride Details */}
              <View className="flex-1">
                <Text className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                  {ridePhase === 'in-trip' ? 'Trip in Progress' : 'Driver En Route'}
                </Text>

                <Text
                  className="mt-0.5 text-sm font-bold text-slate-900"
                  numberOfLines={1}
                >
                  To {ride.dropoff}
                </Text>

                <Text className="mt-0.5 text-xs font-semibold text-slate-500">
                  Total Fare: {formatCurrency(ride.fare.total)}
                </Text>
              </View>

              {/* Track Action Button */}
              <Button
                label="Track"
                size="sm"
                variant="primary"
                onPress={() =>
                  navigation.navigate('TripTracking', { booking: ride, driver })
                }
                rightIcon={<Feather name="chevron-right" size={16} color="#FFFFFF" />}
                className="bg-orange-500 active:bg-orange-600"
              />
            </View>
          </Pressable>
        ) : null}

        {/* Express "Where to?" Search Bar */}
        <Pressable
          onPress={() =>
            passenger.identityVerified
              ? navigation.navigate('RideBooking')
              : navigation.navigate('VerifyAccount', { next: 'RideBooking' })
          }
          className="flex-row items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 active:bg-slate-100/80"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <Text className="text-sm font-medium text-slate-400">
              Where would you like to go?
            </Text>
          </View>
          <View className="rounded-xl bg-slate-100 p-2">
            <Feather name="search" size={16} color="#475569" />
          </View>
        </Pressable>

        {/* Services Section */}
        <View className="gap-3">
          <Text className="text-xs font-black uppercase tracking-widest text-slate-400">
            Services
          </Text>
          <ServiceSelector />
        </View>

        {/* Activity & Stats Section */}
        <View className="gap-3">
          <Text className="text-xs font-black uppercase tracking-widest text-slate-400">
            Activity Stats
          </Text>
          <View className="flex-row gap-3">
            <StatCard
              label="Total Rides"
              value={String(passenger.totalBookings)}
              accent
              icon={
                <MaterialCommunityIcons
                  name="motorbike"
                  size={18}
                  color="#EA580C"
                />
              }
            />
            <StatCard
              label="Total Spent"
              value={formatCurrencyShort(passenger.totalSpent)}
              icon={
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={18}
                  color="#475569"
                />
              }
            />
          </View>
        </View>

        {/* Promotional Banner */}
        <PromoBanner />
      </View>
    </Screen>
  );
}