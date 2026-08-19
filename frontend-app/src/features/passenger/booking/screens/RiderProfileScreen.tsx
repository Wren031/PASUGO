import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Button } from '@/components/buttons/Button';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverProfile } from '@/features/driver/profile/hooks/useDriver';
import { useDriverReviews } from '@/features/driver/profile/hooks/useDriverExtras';
import { useAssignDriver } from '../hooks/useBookRide';
import { showToast } from '@/store/toast-store';
import { formatDuration } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Route = RouteProp<PassengerStackParamList, 'RiderProfile'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function RiderProfileScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { driverId, booking } = route.params;
  const { data: rider, isLoading } = useDriverProfile(driverId);
  const { data: reviews, isLoading: reviewsLoading } = useDriverReviews(driverId);
  const assignDriver = useAssignDriver();

  const selecting = useRef(false);
  const [assigning, setAssigning] = useState(false);

  if (isLoading || !rider) {
    return (
      <Screen>
        <ScreenHeader title="Rider profile" />
        <View className="px-4">
          <SkeletonList count={3} />
        </View>
      </Screen>
    );
  }

  const isCar = rider.vehicleType === 'car';
  const distribution = rider.ratingSummary.distribution;
  const maxCount = Math.max(1, ...Object.values(distribution));
  const displayName = route.params.driver?.name ?? rider.name;

  const handleSelect = () => {
    if (!booking || selecting.current) return;
    selecting.current = true;
    setAssigning(true);
    assignDriver.mutate(
      { bookingId: booking.id, driverId: rider.id },
      {
        onSuccess: (updatedBooking) => {
          navigation.replace('DriverFound', {
            booking: updatedBooking,
            driver: {
              id: rider.id,
              name: rider.name,
              rating: rider.rating,
              trips: rider.totalTrips,
              distanceKm: route.params.driver?.distanceKm ?? 0,
              etaMin: route.params.driver?.etaMin ?? 0,
              coordinates: rider.currentLocation,
              vehicleType: rider.vehicleType,
              vehicleLabel: `${rider.motorcycle.brand} ${rider.motorcycle.model}`,
              plateNumber: rider.motorcycle.plateNumber,
            },
          });
        },
        onError: (err: Error) => {
          selecting.current = false;
          setAssigning(false);
          showToast('error', 'Rider unavailable', err.message);
        },
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Rider account" subtitle="Profile & ratings" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Card className="mt-2 p-5">
          <View className="items-center">
            <Avatar name={rider.name} size="xl" showOnlineDot={rider.availability === 'Available'} />
            <Text className="mt-3 text-[20px] font-extrabold text-ink">{displayName}</Text>
            <View className="mt-1 flex-row items-center gap-2">
              <RatingStars value={rider.rating} size={15} showValue />
              <Text className="text-[12px] text-ink-muted">({rider.ratingSummary.total} ratings)</Text>
            </View>
            <View className="mt-2.5 flex-row gap-2">
              <Badge
                label={rider.identityVerified ? 'Verified rider' : 'Unverified'}
                tone={rider.identityVerified ? 'success' : 'warning'}
                icon={
                  <Feather
                    name={rider.identityVerified ? 'check-circle' : 'alert-triangle'}
                    size={11}
                    color={rider.identityVerified ? '#16A34A' : '#D97706'}
                  />
                }
              />
              <Badge
                label={rider.availability === 'Available' ? 'Available' : rider.availability}
                tone={rider.availability === 'Available' ? 'info' : 'neutral'}
              />
            </View>
          </View>

          <View className="mt-5 flex-row">
            <View className="flex-1 items-center border-r border-line">
              <Text className="text-[18px] font-extrabold text-ink">{rider.totalTrips.toLocaleString()}</Text>
              <Text className="mt-0.5 text-[11px] text-ink-muted">Total rides</Text>
            </View>
            <View className="flex-1 items-center border-r border-line">
              <Text className="text-[18px] font-extrabold text-ink">
                {rider.totalDistanceKm >= 1000
                  ? `${(rider.totalDistanceKm / 1000).toFixed(1)}k`
                  : Math.round(rider.totalDistanceKm)}
              </Text>
              <Text className="mt-0.5 text-[11px] text-ink-muted">km driven</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[18px] font-extrabold text-ink">{rider.yearsExperience}</Text>
              <Text className="mt-0.5 text-[11px] text-ink-muted">Years exp</Text>
            </View>
          </View>
        </Card>

        <Card className="mt-3 p-4">
          <Text className="text-[14px] font-bold text-ink">Rating breakdown</Text>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as keyof typeof distribution] ?? 0;
            return (
              <View key={star} className="mt-2.5 flex-row items-center gap-2.5">
                <Text className="w-6 text-right text-[12px] font-semibold text-ink-secondary">{star}★</Text>
                <View className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <View
                    className="h-full rounded-full bg-warning"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </View>
                <Text className="w-8 text-[11px] text-ink-muted">{count}</Text>
              </View>
            );
          })}
        </Card>

        <Card className="mt-3 p-4">
          <Text className="mb-3 text-[14px] font-bold text-ink">Rider's vehicle</Text>
          <View className="flex-row items-center gap-3">
            <View className={cn('h-11 w-11 items-center justify-center rounded-2xl', isCar ? 'bg-blue-500' : 'bg-primary')}>
              <MaterialCommunityIcons name={isCar ? 'car' : 'motorbike'} size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-[14.5px] font-bold text-ink">
                {isCar ? 'Car' : 'Motorcycle'} · {rider.motorcycle.brand} {rider.motorcycle.model}
              </Text>
              <Text className="mt-0.5 text-[12px] text-ink-muted">
                {rider.motorcycle.year} · {rider.motorcycle.color} · {rider.motorcycle.plateNumber}
              </Text>
            </View>
          </View>
        </Card>

        <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-info-soft px-4 py-3">
          <Feather name="shield" size={14} color="#1D4ED8" />
          <Text className="flex-1 text-[12px] leading-5 text-blue-700">
            {rider.documents.license.status === 'Approved' &&
            rider.documents.orcr.status === 'Approved' &&
            rider.documents.nbi.status === 'Approved'
              ? 'License, ORCR and NBI clearance are all approved.'
              : 'Document verification is still in progress.'}
          </Text>
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Passenger reviews ({reviews?.length ?? 0})
        </Text>
        {reviewsLoading ? (
          <SkeletonList count={2} />
        ) : reviews && reviews.length > 0 ? (
          <View className="gap-3">
            {reviews.slice(0, 5).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        ) : (
          <View className="items-center rounded-2xl border border-dashed border-line bg-white py-8">
            <Feather name="star" size={22} color="#CBD5E1" />
            <Text className="mt-2 text-[13px] font-semibold text-ink-muted">No reviews yet</Text>
          </View>
        )}

        {booking ? (
          <Button
            label={assigning ? 'Selecting rider…' : `Select ${rider.name.split(' ')[0]}`}
            size="lg"
            fullWidth
            className="mt-5"
            loading={assigning}
            onPress={handleSelect}
            leftIcon={
              <MaterialCommunityIcons
                name={isCar ? 'car' : 'motorbike'}
                size={18}
                color="#FFFFFF"
              />
            }
          />
        ) : (
          <View className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-surface-muted px-4 py-3">
            <Feather name="check-circle" size={14} color="#16A34A" />
            <Text className="text-[12.5px] font-semibold text-ink-secondary">
              {rider.availability === 'Available' ? 'This rider is available right now' : 'This rider is currently on a trip'}
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}