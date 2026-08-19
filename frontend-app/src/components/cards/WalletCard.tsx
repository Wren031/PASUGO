import { Pressable, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/format';
import React from 'react';

interface WalletCardProps {
  balance: number;
  subtitle?: string;
  onPress?: () => void;
  actionLabel?: string;
  actionIcon?: 'plus' | 'arrow-down-left';
  onAction?: () => void;
  suffix?: string;
}

export function WalletCard({
  balance,
  subtitle = 'Available balance',
  onPress,
  actionLabel,
  actionIcon = 'plus',
  onAction,
  suffix = 'HAT • 0000',
}: WalletCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-3xl bg-ink p-5 shadow-lg shadow-slate-900/20 elevation-3 active:opacity-95"
    >
      <View className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-primary opacity-25" />
      <View className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-sky-400 opacity-15" />
      <View className="pointer-events-none absolute -bottom-14 right-14 h-24 w-24 rounded-full border-8 border-white/10" />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <MaterialCommunityIcons name="wallet-outline" size={15} color="#FFFFFF" />
          </View>
          <Text className="text-[13px] font-bold text-white">HatodGo Wallet</Text>
        </View>
        {onPress ? <Feather name="chevron-right" size={18} color="#94A3B8" /> : null}
      </View>

      <Text className="mt-4 text-[30px] font-extrabold tracking-tight text-white">
        {formatCurrency(balance)}
      </Text>
      <Text className="mt-0.5 text-[12px] font-medium text-slate-400">{subtitle}</Text>

      <View className="mt-4 flex-row items-center justify-between">
        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            className="flex-row items-center gap-1.5 rounded-full bg-primary px-4 py-2 active:bg-primary-dark"
          >
            <Feather name={actionIcon} size={14} color="#FFFFFF" />
            <Text className="text-[12.5px] font-bold text-white">{actionLabel}</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <View className="flex-row items-center gap-1.5">
          <MaterialCommunityIcons name="contactless-payment" size={14} color="#94A3B8" />
          <Text className="text-[11px] font-semibold tracking-widest text-slate-400">{suffix}</Text>
        </View>
      </View>
    </Pressable>
  );
}