import { FlatList, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { SectionCard } from '@/components/cards/SectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverTrips } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { formatCurrency, formatDateTime } from '@/utils/format';

export function DriverTripsScreen() {
  const user = useAuthStore(selectUser);
  const { data: trips, isLoading } = useDriverTrips(user?.id ?? '');

  return (
    <Screen>
      <ScreenHeader title="Trip history" />
      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        data={trips ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-4">
              <SkeletonList count={4} />
            </View>
          ) : (
            <EmptyState title="No trips yet" message="Completed trips will appear here." icon="navigation" />
          )
        }
        renderItem={({ item, index }) => (
          <SectionCard className={index === 0 ? 'mt-4' : 'mt-2.5'}>
            <View className="flex-row items-center gap-3 px-4 py-3.5">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                <Feather name="arrow-right" size={15} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-semibold text-ink">{item.passengerName}</Text>
                <Text className="mt-0.5 text-[11px] text-ink-muted">
                  {formatDateTime(item.date)} · {item.distanceKm} km · {item.paymentMethod}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[13px] font-extrabold text-success">+{formatCurrency(item.net)}</Text>
                <Text className="text-[10px] text-ink-muted">fare {formatCurrency(item.fare)}</Text>
              </View>
            </View>
          </SectionCard>
        )}
      />
    </Screen>
  );
}
