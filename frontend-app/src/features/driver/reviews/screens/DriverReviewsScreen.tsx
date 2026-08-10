import { FlatList, Text, View } from 'react-native';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverReviews } from '@/features/driver/profile/hooks/useDriverExtras';
import { useAuthStore, selectUser } from '@/store/auth-store';

export function DriverReviewsScreen() {
  const user = useAuthStore(selectUser);
  const { data: reviews, isLoading } = useDriverReviews(user?.id ?? '');

  return (
    <Screen>
      <ScreenHeader title="Passenger reviews" />
      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        data={reviews ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-4">
              <SkeletonList count={3} />
            </View>
          ) : (
            <EmptyState title="No reviews yet" message="Reviews from passengers will appear here." icon="star" />
          )
        }
        renderItem={({ item, index }) => (
          <View className={index === 0 ? 'mt-4' : 'mt-2.5'}>
            <ReviewCard review={item} />
          </View>
        )}
      />
    </Screen>
  );
}
