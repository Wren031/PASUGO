import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, sub, accent = false, className }: StatCardProps) {
  return (
    <Card
      variant={accent ? 'primary-soft' : 'default'}
      className={cn('flex-1', className)}
    >
      {icon ? <View className="mb-2">{icon}</View> : null}
      <Text className={cn('text-xl font-extrabold', accent ? 'text-primary-dark' : 'text-ink')}>{value}</Text>
      <Text className="mt-0.5 text-[12px] font-medium text-ink-secondary">{label}</Text>
      {sub ? <Text className="mt-0.5 text-[11px] text-ink-muted">{sub}</Text> : null}
    </Card>
  );
}
