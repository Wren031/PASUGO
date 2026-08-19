import { Pressable, Text, View } from 'react-native';
import { formatCurrency } from '@/utils/format';
import { useGroceryCart } from '../store/grocery-cart-store';
import type { GroceryStore } from '@/types/grocery';
import React from 'react';

interface ProductRowProps {
  store: GroceryStore;
  product: GroceryStore['products'][number];
}

export function ProductRow({ store, product }: ProductRowProps) {
  const quantity = useGroceryCart((state) =>
    state.lines.find((line) => line.product.id === product.id)?.quantity ?? 0,
  );
  const increment = useGroceryCart((state) => state.addItem);
  const decrement = useGroceryCart((state) => state.decrement);

  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface-muted">
        <Text className="text-[22px]">{product.emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-ink">{product.name}</Text>
        {product.description ? (
          <Text className="mt-0.5 text-[11.5px] leading-4 text-ink-muted">{product.description}</Text>
        ) : null}
        <Text className="mt-1 text-[13.5px] font-extrabold text-primary-dark">
          {formatCurrency(product.price)} <Text className="text-[11px] font-medium text-ink-muted">/ {product.unit}</Text>
        </Text>
      </View>

      {quantity === 0 ? (
        <Pressable
          onPress={() => increment(store, product)}
          className="rounded-full border border-primary px-4 py-2 active:bg-primary-soft"
        >
          <Text className="text-[13px] font-bold text-primary">Add</Text>
        </Pressable>
      ) : (
        <View className="flex-row items-center gap-3 rounded-full bg-primary px-2 py-1">
          <Pressable onPress={() => decrement(product.id)} hitSlop={6} className="px-1.5 py-0.5">
            <Text className="text-[15px] font-bold text-white">−</Text>
          </Pressable>
          <Text className="min-w-[18px] text-center text-[14px] font-bold text-white">{quantity}</Text>
          <Pressable
            onPress={() => increment(store, product)}
            hitSlop={6}
            className="px-1.5 py-0.5"
          >
            <Text className="text-[15px] font-bold text-white">+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}