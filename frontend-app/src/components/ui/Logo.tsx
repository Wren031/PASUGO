import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 22, text: 'text-lg' },
  md: { icon: 28, text: 'text-2xl' },
  lg: { icon: 36, text: 'text-3xl' },
} as const;

export function Logo({ size = 'md', light = false, className }: LogoProps) {
  const s = sizes[size];
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <View className={cn('h-10 w-10 items-center justify-center rounded-xl', light ? 'bg-white' : 'bg-primary')}>
        <MaterialCommunityIcons name="motorbike" size={s.icon} color={light ? '#F97316' : '#FFFFFF'} />
      </View>
      <Text className={cn('font-extrabold tracking-tight', s.text, light ? 'text-white' : 'text-ink')}>
        Hatod<Text className="text-primary">Go</Text>
      </Text>
    </View>
  );
}
