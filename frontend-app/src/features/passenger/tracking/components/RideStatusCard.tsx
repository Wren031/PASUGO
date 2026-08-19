import { Text, View } from 'react-native';
import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/buttons/Button';
import { formatCurrency, formatDistance } from '@/utils/format';
import type { AvailableDriver, Booking, TripPhase } from '@/types/booking';

interface RideStatusCardProps {
  booking: Booking;
  driver: AvailableDriver;
  phase: TripPhase;
  etaMin: number;
  distanceToPickupKm: number;
  onContact: () => void;
  onCancel: () => void;
  onRate: () => void;
  onDone: () => void;
}

export function RideStatusCard({
  booking,
  driver,
  phase,
  etaMin,
  distanceToPickupKm,
  onContact,
  onCancel,
  onRate,
  onDone,
}: RideStatusCardProps) {
  if (phase === 'completed') {
    return (
      <View className="gap-3 rounded-t-3xl border-t border-line bg-white p-5">
        <View className="items-center">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-success-soft">
            <Feather name="check" size={24} color="#22C55E" />
          </View>
          <Text className="mt-2 text-[18px] font-extrabold text-ink">Trip completed</Text>
          <Text className="mt-0.5 text-[13px] text-ink-secondary">
            {formatDistance(booking.distanceKm)} · {formatCurrency(booking.fare.total)}
          </Text>
        </View>
        <View className="rounded-2xl bg-surface-muted p-4">
          <View className="flex-row justify-between">
            <Text className="text-[12px] text-ink-secondary">Base fare</Text>
            <Text className="text-[12px] font-semibold text-ink">{formatCurrency(booking.fare.baseFare)}</Text>
          </View>
          <View className="mt-1.5 flex-row justify-between">
            <Text className="text-[12px] text-ink-secondary">Distance charge</Text>
            <Text className="text-[12px] font-semibold text-ink">{formatCurrency(booking.fare.distanceCharge)}</Text>
          </View>
          <View className="mt-1.5 flex-row justify-between">
            <Text className="text-[12px] text-ink-secondary">Time charge</Text>
            <Text className="text-[12px] font-semibold text-ink">{formatCurrency(booking.fare.timeCharge)}</Text>
          </View>
          <View className="mt-1.5 flex-row justify-between">
            <Text className="text-[12px] text-ink-secondary">Booking fee</Text>
            <Text className="text-[12px] font-semibold text-ink">{formatCurrency(booking.fare.bookingFee)}</Text>
          </View>
          <View className="my-2 h-px bg-line" />
          <View className="flex-row justify-between">
            <Text className="text-[13px] font-bold text-ink">Total</Text>
            <Text className="text-[15px] font-extrabold text-primary-dark">{formatCurrency(booking.fare.total)}</Text>
          </View>
        </View>
        <Button label="Rate your driver" fullWidth onPress={onRate} />
        <Button label="Done" variant="outline" fullWidth onPress={onDone} />
      </View>
    );
  }

  if (phase === 'cancelled') {
    return (
      <View className="gap-3 rounded-t-3xl border-t border-line bg-white p-5">
        <Text className="text-center text-[17px] font-extrabold text-ink">Trip cancelled</Text>
        <Button label="Back to home" fullWidth onPress={onDone} />
      </View>
    );
  }

  const onTheWay = phase === 'accepted' || phase === 'arriving';
  const inTrip = phase === 'in-trip';

  return (
    <View className="gap-3 rounded-t-3xl border-t border-line bg-white p-5">
      <View className="flex-row items-center gap-3">
        <Avatar name={driver.name} size="lg" showOnlineDot />
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-ink">{driver.name}</Text>
          <RatingStars value={driver.rating} size={12} showValue />
        </View>
        <View className="items-end">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name={driver.vehicleType === 'car' ? 'car' : 'motorbike'}
              size={14}
              color="#F97316"
            />
            <Text className="text-[12px] font-bold text-ink">{driver.plateNumber}</Text>
          </View>
          <Text className="text-[11px] text-ink-muted">{driver.vehicleLabel}</Text>
        </View>
      </View>

      {inTrip ? (
        <View className="rounded-2xl bg-primary-soft p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] font-semibold text-primary-dark">Arriving at destination</Text>
              <Text className="mt-0.5 text-[20px] font-extrabold text-ink">{etaMin} min</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Feather name="navigation" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>
      ) : (
        <View className="rounded-2xl bg-surface-muted p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] font-semibold text-ink-secondary">
                {onTheWay ? 'Arriving at pickup in' : 'Pickup nearby'}
              </Text>
              <Text className="mt-0.5 text-[20px] font-extrabold text-ink">
                {onTheWay ? `${etaMin} min` : formatDistance(distanceToPickupKm)}
              </Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Feather name="navigation" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>
      )}

      <View className="flex-row gap-3">
        <Button
          label="Contact"
          variant="outline"
          className="flex-1"
          onPress={onContact}
          leftIcon={<Feather name="phone" size={16} color="#0F172A" />}
        />
        {!inTrip ? (
          <Button
            label="Cancel ride"
            variant="danger"
            className="flex-1"
            onPress={onCancel}
            leftIcon={<Feather name="x" size={16} color="#FFFFFF" />}
          />
        ) : null}
      </View>
    </View>
  );
}
