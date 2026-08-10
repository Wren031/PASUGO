import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { TripCard } from '@/components/cards/TripCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { usePassengerTrips } from '../hooks/usePassengerTrips';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { cn } from '@/utils/cn';
import type { BookingStatus } from '@/types/common';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

type Filter = 'all' | 'active' | 'completed' | 'cancelled';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const activeStatuses: BookingStatus[] = ['Pending', 'Searching Driver', 'Accepted', 'Driver Arrived', 'In Progress'];

export function TripsScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: trips, isLoading } = usePassengerTrips(user?.id ?? '');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (!trips) return [];
    switch (filter) {
      case 'active':
        return trips.filter((t) => activeStatuses.includes(t.status));
      case 'completed':
        return trips.filter((t) => t.status === 'Completed');
      case 'cancelled':
        return trips.filter((t) => t.status === 'Cancelled');
      default:
        return trips;
    }
  }, [trips, filter]);

  return (
    <Screen contentClassName="pb-6">
      <View className="bg-white px-4 pb-3 pt-4">
        <Text className="text-[22px] font-extrabold tracking-tight text-ink">My Trips</Text>
        <View className="mt-3 flex-row gap-2">
          {filters.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5',
                filter === item.key ? 'border-primary bg-primary' : 'border-line bg-white',
              )}
            >
              <Text
                className={cn(
                  'text-[12px] font-semibold',
                  filter === item.key ? 'text-white' : 'text-ink-secondary',
                )}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="mt-4"><SkeletonList count={3} /></View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Feather name="calendar" size={26} color="#F97316" />}
          title="No trips yet"
          message="Your ride history will show up here once you book your first ride."
          actionLabel="Book a ride"
          onAction={() => navigation.navigate('PassengerTabs', { screen: 'Home' })}
        />
      ) : (
        <View className="mt-4 gap-3 px-4">
          {filtered.map((booking) => (
            <TripCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('TripDetails', { booking })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
