import { ActivityIndicator, View } from 'react-native';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'small' | 'large';
  className?: string;
}

export function Spinner({ size = 'small', className }: SpinnerProps) {
  return (
    <View className={cn('items-center justify-center p-4', className)}>
      <ActivityIndicator size={size} color="#F97316" />
    </View>
  );
}
