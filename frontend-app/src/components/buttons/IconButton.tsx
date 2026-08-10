import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { cn } from '@/utils/cn';

interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  className?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export function IconButton({ icon, onPress, className, accessibilityLabel, disabled }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full active:bg-slate-100',
        disabled && 'opacity-40',
        className,
      )}
    >
      {icon}
    </Pressable>
  );
}
