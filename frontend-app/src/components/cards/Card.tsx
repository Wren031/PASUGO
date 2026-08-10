import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { cn } from '@/utils/cn';

type CardVariant = 'default' | 'muted' | 'primary-soft' | 'outlined';

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-line',
  muted: 'bg-surface-muted border border-line',
  'primary-soft': 'bg-primary-soft border border-primary-lighter',
  outlined: 'bg-white border border-line',
};

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  padded?: boolean;
  onPress?: () => void;
}

export function Card({ children, variant = 'default', className, padded = true, onPress }: CardProps) {
  const content = (
    <View className={cn('rounded-2xl', variantClasses[variant], padded && 'p-4', className)}>{children}</View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} className={cn('rounded-2xl active:opacity-80', className)}>
      <View className={cn('rounded-2xl', variantClasses[variant], padded && 'p-4')}>{children}</View>
    </Pressable>
  );
}
