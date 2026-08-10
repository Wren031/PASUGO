import { View } from 'react-native';
import { cn } from '@/utils/cn';

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <View className={cn('h-px w-full bg-line', className)} />;
}
