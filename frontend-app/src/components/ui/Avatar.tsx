import { Text, View } from 'react-native';
import { cn } from '@/utils/cn';

const sizeMap = {
  xs: 'h-7 w-7 rounded-full',
  sm: 'h-9 w-9 rounded-full',
  md: 'h-12 w-12 rounded-full',
  lg: 'h-16 w-16 rounded-full',
  xl: 'h-20 w-20 rounded-full',
} as const;

const textMap = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-xl',
} as const;

interface AvatarProps {
  name: string;
  size?: keyof typeof sizeMap;
  showOnlineDot?: boolean;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({ name, size = 'md', showOnlineDot = false, className }: AvatarProps) {
  return (
    <View className={cn('relative', className)}>
      <View className={cn('items-center justify-center bg-primary-soft', sizeMap[size])}>
        <Text className={cn('font-bold text-primary-dark', textMap[size])}>{initials(name)}</Text>
      </View>
      {showOnlineDot && (
        <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success" />
      )}
    </View>
  );
}
