import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

const toneClasses: Record<BadgeTone, string> = {
  primary: 'bg-primary-soft text-primary-dark',
  success: 'bg-success-soft text-green-700',
  danger: 'bg-danger-soft text-red-700',
  warning: 'bg-warning-soft text-amber-700',
  info: 'bg-info-soft text-blue-700',
  neutral: 'bg-slate-100 text-ink-secondary',
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ label, tone = 'neutral', icon, className }: BadgeProps) {
  return (
    <View className={cn('flex-row items-center gap-1 self-start rounded-full px-2.5 py-1', toneClasses[tone], className)}>
      {icon}
      <Text className="text-[11px] font-semibold">{label}</Text>
    </View>
  );
}
