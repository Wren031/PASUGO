import { View } from 'react-native';
import { DriverCard } from '@/components/cards/DriverCard';
import type { AvailableDriver } from '@/types/booking';

interface NearbyDriversListProps {
  drivers: AvailableDriver[];
  onSelect: (driver: AvailableDriver) => void;
}

export function NearbyDriversList({ drivers, onSelect }: NearbyDriversListProps) {
  return (
    <View className="gap-3">
      {drivers.map((driver) => (
        <DriverCard key={driver.id} driver={driver} onPress={() => onSelect(driver)} />
      ))}
    </View>
  );
}
