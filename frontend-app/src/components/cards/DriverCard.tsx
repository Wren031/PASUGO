import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { formatDistance, formatDuration } from '@/utils/format';
import type { AvailableDriver } from '@/types/booking';
import { cn } from '@/utils/cn';

interface DriverCardProps {
  driver: AvailableDriver;
  onPress?: () => void;
  selected?: boolean;
  className?: string;
}

export function DriverCard({ driver, onPress, selected = false, className }: DriverCardProps) {
  return (
    <Card
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 p-3',
        selected && 'border-primary bg-primary-soft',
        className,
      )}
    >
      <Avatar name={driver.name} size="md" showOnlineDot />
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-[15px] font-bold text-ink">{driver.name}</Text>
          <RatingStars value={driver.rating} size={11} showValue />
        </View>
        <Text className="mt-0.5 text-[12px] text-ink-secondary">
          {driver.motorcycle} · {driver.plateNumber}
        </Text>
        <View className="mt-1.5 flex-row items-center gap-2">
          <Badge label={`${formatDistance(driver.distanceKm)} away`} tone="primary" />
          <Badge label={`ETA ${formatDuration(driver.etaMin)}`} tone="neutral" />
        </View>
      </View>
      <View className="items-end gap-1">
        <Text className="text-[11px] text-ink-muted">{driver.trips.toLocaleString()} rides</Text>
        <Feather name="chevron-right" size={16} color="#94A3B8" />
      </View>
    </Card>
  );
}
