import { useState } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { TextArea } from '@/components/inputs/TextArea';
import { Button } from '@/components/buttons/Button';
import { useSubmitReview } from '../hooks/useReviews';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { useRideStore } from '@/store/ride-store';
import { showToast } from '@/store/toast-store';
import type { PassengerStackParamList } from '@/navigation/types';

type Route = RouteProp<PassengerStackParamList, 'ReviewDriver'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const quickComments = [
  'Very courteous driver',
  'Fast and safe ride',
  'Clean motorcycle',
  'Great route knowledge',
];

export function ReviewDriverScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking } = route.params;
  const user = useAuthStore(selectUser);
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      showToast('error', 'Please select a rating');
      return;
    }
    submitReview.mutate(
      {
        targetId: booking.driverId ?? '',
        targetName: booking.driverName ?? 'Driver',
        bookingId: booking.id,
        rating,
        comment: comment.trim() || 'No comment',
        authorName: user?.name ?? 'Passenger',
        authorRole: 'passenger',
      },
      {
        onSuccess: () => {
          useRideStore.getState().reset();
          showToast('success', 'Thank you!', 'Your review has been submitted.');
          navigation.popToTop();
        },
        onError: (error: Error) => showToast('error', 'Submit failed', error.message),
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Rate your driver" />
      <View className="flex-1 px-4 pb-6">
        <View className="items-center py-6">
          <Avatar name={booking.driverName ?? 'Driver'} size="xl" />
          <Text className="mt-3 text-[18px] font-extrabold text-ink">{booking.driverName}</Text>
          <Text className="mt-0.5 text-[12px] text-ink-muted">Booking {booking.id}</Text>
          <RatingStars value={rating} size={34} interactive onChange={setRating} className="mt-4" />
          <Text className="mt-2 text-[12px] text-ink-muted">
            {rating === 0 ? 'Tap a star to rate' : `You rated ${rating} star${rating > 1 ? 's' : ''}`}
          </Text>
        </View>

        <Text className="mb-2 text-[13px] font-semibold text-ink">How was your ride?</Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {quickComments.map((item) => (
            <Button
              key={item}
              label={item}
              variant={comment === item ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setComment((current) => (current === item ? '' : item))}
            />
          ))}
        </View>

        <TextArea
          label="Write a review (optional)"
          value={comment}
          onChangeText={setComment}
          placeholder="Share details about your ride experience…"
          maxLength={280}
        />

        <View className="flex-1" />
        <Button
          label="Submit review"
          size="lg"
          fullWidth
          loading={submitReview.isPending}
          onPress={handleSubmit}
        />
      </View>
    </Screen>
  );
}
