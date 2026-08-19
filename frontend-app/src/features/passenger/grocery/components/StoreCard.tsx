import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/format';
import type { GroceryStore } from '@/types/grocery';
import React from 'react';

interface StoreCardProps {
  store: GroceryStore;
  onPress: () => void;
}

export function StoreCard({ store, onPress }: StoreCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-line bg-white p-3.5 active:bg-surface-muted"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-center">
        <Text className="text-[26px]">{store.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-ink">{store.name}</Text>
        <Text className="mt-0.5 text-[12px] text-ink-muted">
          {store.category} · {store.address}
        </Text>
        <View className="mt-1.5 flex-row items-center gap-2">
          <Badge
            label={`${store.rating.toFixed(1)} ★`}
            tone="warning"
          />
          <Badge
            label={`${formatCurrency(store.deliveryFee)} delivery`}
            tone="neutral"
          />
          <Badge
            label={`${store.etaMin} min`}
            tone="primary"
          />
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
    </Pressable>
  );
}