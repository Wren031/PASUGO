import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation, type CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { StatCard } from '@/components/cards/StatCard';
import { SectionCard } from '@/components/cards/SectionCard';
import { Toggle } from '@/components/ui/Toggle';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverProfile, useDriverEarnings } from '@/features/driver/profile/hooks/useDriver';
import { useDriverRideRequests } from '@/features/driver/profile/hooks/useDriver';
import { useDriverStore } from '@/store/driver-store';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { formatCurrency } from '@/utils/format';
import type { DriverStackParamList, DriverTabParamList } from '@/navigation/types';
import React from 'react';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList, 'Home'>,
  NativeStackNavigationProp<DriverStackParamList>
>;

export function DriverDashboardScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const driverId = user?.id ?? '';
  const { data: driver, isLoading: profileLoading } = useDriverProfile(driverId);
  const { data: earnings } = useDriverEarnings(driverId);
  const { data: requests } = useDriverRideRequests(driverId);

  const online = useDriverStore((state) => state.online);
  const incomingRequest = useDriverStore((state) => state.incomingRequest);
  const activeRequest = useDriverStore((state) => state.activeRequest);
  const setOnline = useDriverStore((state) => state.setOnline);
  const seedRequests = useDriverStore((state) => state.seedRequests);
  const emitRequest = useDriverStore((state) => state.emitRequest);
  const phase = useDriverStore((state) => state.phase);

  const [emitting, setEmitting] = useState(false);

  useEffect(() => {
    if (requests && requests.length > 0) {
      seedRequests(requests);
    }
  }, [requests, seedRequests]);

  useEffect(() => {
    if (!online) return;
    const timer = setTimeout(() => emitRequest(), 5000);
    return () => clearTimeout(timer);
  }, [online, incomingRequest, emitRequest]);

  useEffect(() => {
    if (incomingRequest) {
      setEmitting(false);
      navigation.navigate('RideRequest');
    }
  }, [incomingRequest, navigation]);

  const handleToggle = (value: boolean) => {
    setOnline(value);
    if (value) {
      setEmitting(true);
    } else {
      setEmitting(false);
      useDriverStore.getState().rejectRequest();
    }
  };

  return (
    <Screen>
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-line bg-white p-4">
          <Avatar name={user?.name ?? 'Driver'} size="lg" showOnlineDot={online} />
          <View className="flex-1">
            <Text className="text-[16px] font-extrabold text-ink">{user?.name}</Text>
            {driver ? (
              <>
                <View className="mt-0.5 flex-row items-center gap-2">
                  <RatingStars value={driver.rating} size={12} showValue />
                  <Text className="text-[11px] text-ink-muted">{driver.totalTrips} trips · {driver.yearsExperience} yrs exp</Text>
                </View>
                <View className="mt-1 flex-row items-center gap-1">
                  <Feather
                    name={driver.identityVerified ? 'check-circle' : 'alert-triangle'}
                    size={11}
                    color={driver.identityVerified ? '#16A34A' : '#D97706'}
                  />
                  <Text className={`text-[11px] font-semibold ${driver.identityVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {driver.identityVerified ? 'Verified' : 'Unverified'}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            className="rounded-full border border-line bg-white p-2.5 active:bg-slate-50"
          >
            <Feather name="user" size={17} color="#F97316" />
          </Pressable>
        </View>

        <View className="mt-4 rounded-2xl bg-primary p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[13px] font-bold text-white">You are {online ? 'online' : 'offline'}</Text>
              <Text className="mt-1 text-[12px] text-orange-100">
                {online
                  ? activeRequest
                    ? `Trip in progress — ${phase}`
                    : emitting
                      ? 'Looking for ride requests…'
                      : 'Ready to receive ride requests'
                  : 'Go online to start receiving requests'}
              </Text>
            </View>
            <Toggle value={online} onValueChange={handleToggle} />
          </View>
        </View>

        {activeRequest ? (
          <Pressable
            onPress={() => navigation.navigate('ActiveTrip')}
            className="mt-4 flex-row items-center gap-3 rounded-2xl border border-primary bg-orange-50 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Feather name="navigation" size={18} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-primary-dark">Active trip</Text>
              <Text className="mt-0.5 text-[12px] text-ink-secondary">
                {activeRequest.pickup} → {activeRequest.dropoff}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#F97316" />
          </Pressable>
        ) : null}

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Today</Text>
        {profileLoading && !earnings ? (
          <SkeletonList count={2} />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              label="Net earnings"
              value={formatCurrency(earnings?.today.netEarnings ?? 0)}
              icon={<Feather name="credit-card" size={18} color="#F97316" />}
              accent
              className="flex-1 min-w-[45%]"
            />
            <StatCard
              label="Trips"
              value={String(earnings?.today.trips ?? 0)}
              icon={<Feather name="navigation" size={18} color="#64748B" />}
              className="flex-1 min-w-[45%]"
            />
            <StatCard
              label="Gross"
              value={formatCurrency(earnings?.today.grossEarnings ?? 0)}
              icon={<Feather name="trending-up" size={18} color="#64748B" />}
              className="flex-1 min-w-[45%]"
            />
            <StatCard
              label="Commission"
              value={formatCurrency(earnings?.today.commission ?? 0)}
              icon={<Feather name="percent" size={18} color="#64748B" />}
              className="flex-1 min-w-[45%]"
            />
          </View>
        )}

        {earnings?.recentTrips && earnings.recentTrips.length > 0 ? (
          <>
            <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Recent trips</Text>
            <SectionCard>
              {earnings.recentTrips.slice(0, 4).map((trip, index) => (
                <View
                  key={trip.id}
                  className={`flex-row items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-line' : ''}`}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <Feather name="arrow-right" size={15} color="#F97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold text-ink">{trip.passengerName}</Text>
                    <Text className="mt-0.5 text-[11px] text-ink-muted">
                      {trip.distanceKm} km · {trip.paymentMethod}
                    </Text>
                  </View>
                  <Text className="text-[13px] font-extrabold text-success">+{formatCurrency(trip.net)}</Text>
                </View>
              ))}
            </SectionCard>
          </>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate('Earnings')}
          className="mt-4 flex-row items-center justify-between rounded-2xl border border-line bg-white p-4 active:bg-slate-50"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Feather name="bar-chart-2" size={17} color="#F97316" />
            </View>
            <Text className="text-[14px] font-bold text-ink">View earnings report</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#CBD5E1" />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
