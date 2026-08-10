import { Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { greeting, firstName } from '@/utils/format';

interface GreetingHeaderProps {
  name: string;
  rating: number;
}

export function GreetingHeader({ name, rating }: GreetingHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-ink-secondary">{greeting()},</Text>
        <Text className="mt-1 text-[24px] font-extrabold leading-8 tracking-tight text-ink">{firstName(name)}</Text>
      </View>
      <View className="items-end gap-1.5">
        <Avatar name={name} size="md" showOnlineDot />
        <Badge label={`${rating.toFixed(1)} rating`} tone="neutral" />
      </View>
    </View>
  );
}
