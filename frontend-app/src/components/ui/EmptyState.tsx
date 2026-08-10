import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { Button } from '@/components/buttons/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-8 py-12">
      {icon ? <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">{icon}</View> : null}
      <Text className="text-center text-[17px] font-bold text-ink">{title}</Text>
      {message ? <Text className="mt-1.5 text-center text-sm leading-5 text-ink-muted">{message}</Text> : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} className="mt-5" /> : null}
    </View>
  );
}
