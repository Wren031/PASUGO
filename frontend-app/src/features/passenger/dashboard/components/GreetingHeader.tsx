import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { greeting, firstName } from '@/utils/format';
import React from 'react';

interface GreetingHeaderProps {
  name: string;
  rating: number;
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function GreetingHeader({ name, rating }: GreetingHeaderProps) {
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
        <View className="flex-row items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5">
          <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
          <Text className="text-[11.5px] font-bold text-amber-700">{rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}