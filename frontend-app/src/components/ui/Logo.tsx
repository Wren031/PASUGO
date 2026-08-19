import { Image, Text, View } from 'react-native';
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
      <Image
        source={require('../../../assets/icon_hatodgo.png')}
        style={{ width: s.icon, height: s.icon }}
        resizeMode="contain"
      />
      <Text className={cn('font-extrabold tracking-tight', s.text, light ? 'text-white' : 'text-ink')}>
        Hatod<Text className="text-primary">Go</Text>
      </Text>
    </View>
  );
}
