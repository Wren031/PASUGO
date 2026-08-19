import { Pressable, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/cards/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { AvailableDriver } from '@/types/booking';
import React from 'react';

interface RiderSelectCardProps {
  driver: AvailableDriver;
  fareTotal: number;
  onSelect: () => void;
  onPress?: () => void;
  selecting?: boolean;
}

export function RiderSelectCard({ driver, fareTotal, onSelect, onPress, selecting = false }: RiderSelectCardProps) {
  const isCar = driver.vehicleType === 'car';
  const accentBg = isCar ? 'bg-blue-500' : 'bg-primary';
  const accentText = isCar ? 'text-blue-700' : 'text-primary-dark';

  return (
    <Card onPress={onPress} className="p-4">
      <View className="flex-row items-center gap-3">
        <Avatar name={driver.name} size="lg" showOnlineDot />
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="flex-1 text-[15px] font-bold text-ink">{driver.name}</Text>
            {onPress ? <Feather name="chevron-right" size={15} color="#CBD5E1" /> : null}
          </View>
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <RatingStars value={driver.rating} size={11} showValue />
            <Text className="text-[11px] text-ink-muted">· {driver.trips.toLocaleString()} rides</Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <Badge label={`${formatDistance(driver.distanceKm)} away`} tone="primary" />
          <Text className="text-[11px] text-ink-muted">ETA {formatDuration(driver.etaMin)}</Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center gap-2.5 rounded-2xl bg-surface-muted px-3.5 py-2.5">
        <View className={accentBg + ' h-8 w-8 items-center justify-center rounded-full'}>
          <MaterialCommunityIcons
            name={isCar ? 'car' : 'motorbike'}
            size={16}
            color="#FFFFFF"
          />
        </View>
        <View className="flex-1">
          <Text className="text-[12.5px] font-bold text-ink">
            {isCar ? 'Car' : 'Motorcycle'} · {driver.vehicleLabel}
          </Text>
          <Text className="text-[11px] text-ink-muted">Plate {driver.plateNumber}</Text>
        </View>
        <View className="items-end">
          <Text className="text-[11px] text-ink-muted">Estimated fare</Text>
          <Text className={accentText + ' text-[15px] font-extrabold'}>{formatCurrency(fareTotal)}</Text>
        </View>
      </View>

      <Pressable
        onPress={onSelect}
        disabled={selecting}
        className={cn(
          'mt-3 flex-row items-center justify-center gap-2 rounded-xl py-3 active:opacity-90',
          isCar ? 'bg-blue-500' : 'bg-primary',
        )}
      >
        <MaterialCommunityIcons name={isCar ? 'car' : 'motorbike'} size={16} color="#FFFFFF" />
        <Text className="text-[13.5px] font-bold text-white">
          {selecting ? 'Assigning rider…' : 'Select rider'}
        </Text>
      </Pressable>
    </Card>
  );
}