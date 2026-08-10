import { ScrollView, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/buttons/Button';
import { Divider } from '@/components/ui/Divider';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { TimelineEvent } from '@/types/common';
import type { PassengerStackParamList } from '@/navigation/types';
import { cn } from '@/utils/cn';

type Route = RouteProp<PassengerStackParamList, 'TripDetails'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function TripDetailsScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { booking } = route.params;

  return (
    <Screen>
      <ScreenHeader title="Trip details" subtitle={booking.id} />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-[13px] text-ink-muted">{formatDateTime(booking.bookedAt)}</Text>
          <StatusBadge status={booking.status} />
        </View>

        <View className="mt-3 rounded-2xl border border-line bg-white p-4">
          <View className="flex-row">
            <View className="mr-3 items-center">
              <View className="h-2.5 w-2.5 rounded-full bg-success" />
              <View className="w-px flex-1 border-l border-dashed border-line" />
              <View className="h-2.5 w-2.5 rounded-full bg-danger" />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-bold text-ink">{booking.pickup}</Text>
              <Text className="mt-5 text-[16px] font-bold text-ink">{booking.dropoff}</Text>
            </View>
          </View>
          <View className="mt-3 flex-row gap-4 border-t border-line pt-3">
            <View>
              <Text className="text-[11px] text-ink-muted">Distance</Text>
              <Text className="text-[13px] font-bold text-ink">{booking.distanceKm} km</Text>
            </View>
            <View>
              <Text className="text-[11px] text-ink-muted">Duration</Text>
              <Text className="text-[13px] font-bold text-ink">{booking.durationMin} min</Text>
            </View>
            <View>
              <Text className="text-[11px] text-ink-muted">Payment</Text>
              <Text className="text-[13px] font-bold text-ink">{booking.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {booking.driverName ? (
          <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <Avatar name={booking.driverName} size="md" showOnlineDot />
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">{booking.driverName}</Text>
              {booking.driverRating ? <RatingStars value={booking.driverRating} size={12} showValue /> : null}
            </View>
            {booking.ratingValue ? (
              <View className="items-end">
                <Text className="text-[11px] text-ink-muted">You rated</Text>
                <RatingStars value={booking.ratingValue} size={12} />
              </View>
            ) : null}
          </View>
        ) : null}

        <View className="mt-4 rounded-2xl border border-line bg-white p-4">
          <Text className="text-[15px] font-bold text-ink">Fare breakdown</Text>
          <View className="mt-3 gap-2">
            <FareRow label="Base fare" value={booking.fare.baseFare} />
            <FareRow label="Distance charge" value={booking.fare.distanceCharge} />
            <FareRow label="Time charge" value={booking.fare.timeCharge} />
            <FareRow label="Booking fee" value={booking.fare.bookingFee} />
            {booking.fare.discount > 0 ? <FareRow label="Discount" value={-booking.fare.discount} /> : null}
            {booking.fare.surgeMultiplier > 1 ? (
              <FareRow label="Surge" value={booking.fare.total - (booking.fare.baseFare + booking.fare.distanceCharge + booking.fare.timeCharge + booking.fare.bookingFee - booking.fare.discount)} />
            ) : null}
          </View>
          <Divider className="my-3" />
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-bold text-ink">Total</Text>
            <Text className="text-[18px] font-extrabold text-primary-dark">{formatCurrency(booking.fare.total)}</Text>
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-line bg-white p-4">
          <Text className="text-[15px] font-bold text-ink">Timeline</Text>
          <View className="mt-3 gap-4">
            {booking.timeline.map((event: TimelineEvent, index: number) => (
              <View key={event.id} className="flex-row">
                <View className="mr-3 items-center">
                  <View
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      event.status === 'done' ? 'bg-success' : event.status === 'current' ? 'bg-primary' : 'bg-line',
                    )}
                  />
                  {index < booking.timeline.length - 1 ? <View className="w-px flex-1 bg-line" /> : null}
                </View>
                <View className="flex-1 pb-1">
                  <Text className="text-[14px] font-semibold text-ink">{event.label}</Text>
                  {event.description ? <Text className="mt-0.5 text-[12px] text-ink-muted">{event.description}</Text> : null}
                  <Text className="mt-0.5 text-[11px] text-ink-muted">{formatDateTime(event.timestamp)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {booking.status === 'Completed' && !booking.rated ? (
          <Button
            label="Rate your driver"
            fullWidth
            className="mt-4"
            onPress={() => navigation.navigate('ReviewDriver', { booking })}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function FareRow({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[13px] text-ink-secondary">{label}</Text>
      <Text className="text-[13px] font-semibold text-ink">{formatCurrency(value)}</Text>
    </View>
  );
}
