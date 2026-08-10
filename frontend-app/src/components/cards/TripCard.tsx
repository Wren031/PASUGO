import { Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Booking } from '@/types/booking';
import { cn } from '@/utils/cn';

interface TripCardProps {
  booking: Booking;
  onPress?: () => void;
  className?: string;
}

export function TripCard({ booking, onPress, className }: TripCardProps) {
  return (
    <Card onPress={onPress} className={cn('p-0', className)}>
      <View className="border-b border-line p-4 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] font-semibold text-ink-muted">{formatDateTime(booking.bookedAt)}</Text>
          <StatusBadge status={booking.status} />
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row">
          <View className="mr-3 items-center">
            <View className="h-2.5 w-2.5 rounded-full bg-success" />
            <View className="w-px flex-1 border-l border-dashed border-line" />
            <View className="h-2.5 w-2.5 rounded-full bg-danger" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-ink">{booking.pickup}</Text>
            <Text className="mt-4 text-[15px] font-semibold text-ink">{booking.dropoff}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between border-t border-line pt-3">
          <View className="flex-row items-center gap-2">
            {booking.driverName ? (
              <>
                <Avatar name={booking.driverName} size="xs" />
                <View>
                  <Text className="text-[13px] font-semibold text-ink">{booking.driverName}</Text>
                  {booking.driverRating ? (
                    <RatingStars value={booking.driverRating} size={11} showValue />
                  ) : null}
                </View>
              </>
            ) : (
              <View className="flex-row items-center gap-1.5">
                <Feather name="map-pin" size={13} color="#94A3B8" />
                <Text className="text-[13px] text-ink-muted">{booking.distanceKm} km · {booking.durationMin} min</Text>
              </View>
            )}
          </View>
          <View className="items-end">
            <Text className="text-base font-extrabold text-ink">{formatCurrency(booking.fare.total)}</Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MaterialCommunityIcons name="cash" size={12} color="#94A3B8" />
              <Text className="text-[11px] text-ink-muted">{booking.paymentMethod}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
