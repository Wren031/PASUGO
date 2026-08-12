import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export function PromoBanner() {
  return (
    <View className="relative overflow-hidden rounded-3xl bg-primary">
      <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary-lighter/40" />
      <View className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-white/10" />
      <View className="relative flex-row items-center gap-4 px-5 py-5">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
          <MaterialCommunityIcons name="percent" size={24} color="#F97316" />
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-white">Weekend promo: 20% off</Text>
          <Text className="mt-0.5 text-[12px] text-orange-100">
            Use code WEEKEND20 on your next ride. Valid until Sunday.
          </Text>
        </View>
        <View className="items-center rounded-xl border border-dashed border-white/70 bg-white/15 px-3 py-2">
          <Text className="text-[12px] font-extrabold tracking-widest text-white">WEEKEND20</Text>
        </View>
      </View>
    </View>
  );
}