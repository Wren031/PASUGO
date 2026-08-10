import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';
import type { Vehicle } from '@/types/vehicle';
import { cn } from '@/utils/cn';

const statusTone = {
  Active: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  'Under Review': 'info',
} as const;

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
  className?: string;
}

export function VehicleCard({ vehicle, onPress, className }: VehicleCardProps) {
  return (
    <Card onPress={onPress} className={cn('p-4', className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
            <MaterialCommunityIcons name="motorbike" size={24} color="#F97316" />
          </View>
          <View>
            <Text className="text-[15px] font-bold text-ink">
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text className="text-[13px] text-ink-secondary">{vehicle.plateNumber} · {vehicle.year}</Text>
          </View>
        </View>
        <Badge label={vehicle.status} tone={statusTone[vehicle.status]} />
      </View>
      <View className="mt-3 flex-row justify-between rounded-2xl bg-surface-muted px-3 py-2.5">
        <View>
          <Text className="text-[11px] text-ink-muted">Registration</Text>
          <Text className="mt-0.5 text-[12px] font-semibold text-ink">{formatDate(vehicle.registrationExpiry)}</Text>
        </View>
        <View>
          <Text className="text-[11px] text-ink-muted">Insurance</Text>
          <Text className="mt-0.5 text-[12px] font-semibold text-ink">{formatDate(vehicle.insuranceExpiry)}</Text>
        </View>
        <View>
          <Text className="text-[11px] text-ink-muted">Trips</Text>
          <Text className="mt-0.5 text-[12px] font-semibold text-ink">{vehicle.tripsCount.toLocaleString()}</Text>
        </View>
      </View>
    </Card>
  );
}
