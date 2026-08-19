import { Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { greeting, firstName } from '@/utils/format';
import { cn } from '@/utils/cn';
import React from 'react';

interface GreetingHeaderProps {
  name: string;
  rating: number;
  verified?: boolean;
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function GreetingHeader({ name, rating, verified }: GreetingHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-[13px] font-medium text-ink-muted">{todayLabel()}</Text>
        <Text className="mt-1 text-[26px] font-extrabold leading-8 tracking-tight text-ink">
          {greeting()}, {firstName(name)}
        </Text>
        <Text className="mt-0.5 text-[13.5px] text-ink-secondary">Where are you headed today?</Text>
      </View>
      <View className="items-end gap-2">
        <Avatar name={name} size="md" showOnlineDot />
        <View className="flex-row items-center gap-1.5">
          <View className="flex-row items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5">
            <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
            <Text className="text-[11.5px] font-bold text-amber-700">{rating.toFixed(1)}</Text>
          </View>
          {verified !== undefined ? (
            <View
              className={cn(
                'flex-row items-center gap-1 rounded-full px-2 py-0.5',
                verified ? 'bg-success-soft' : 'bg-warning-soft',
              )}
            >
              <Feather name={verified ? 'check-circle' : 'alert-triangle'} size={11} color={verified ? '#16A34A' : '#D97706'} />
              <Text className={cn('text-[11px] font-bold', verified ? 'text-green-700' : 'text-amber-700')}>
                {verified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}