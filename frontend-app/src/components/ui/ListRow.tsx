import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

interface ListRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
  right?: ReactNode;
}

export function ListRow({ icon, label, value, onPress, last = false, right }: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className={cn(
        'flex-row items-center justify-between bg-white px-4 py-4 active:bg-slate-50',
        !last && 'border-b border-line',
      )}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {icon ? <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">{icon}</View> : null}
        <View className="flex-1">
          <Text className="text-[15px] font-medium text-ink">{label}</Text>
          {value ? <Text className="mt-0.5 text-[13px] leading-5 text-ink-muted">{value}</Text> : null}
        </View>
      </View>
      {right ?? (onPress ? <Feather name="chevron-right" size={18} color="#94A3B8" /> : null)}
    </Pressable>
  );
}
