import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomSheet } from '@/components/modals/BottomSheet';
import { Button } from '@/components/buttons/Button';
import { formatCurrency } from '@/utils/format';
import {
  selectCartSubtotal,
  selectCartItemCount,
  useGroceryCart,
} from '../store/grocery-cart-store';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

interface CartSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function CartSheet({ visible, onClose }: CartSheetProps) {
  const navigation = useNavigation<Navigation>();
  const lines = useGroceryCart((state) => state.lines);
  const store = useGroceryCart((state) => state.store);
  const increment = useGroceryCart((state) => state.increment);
  const decrement = useGroceryCart((state) => state.decrement);
  const subtotal = useGroceryCart(selectCartSubtotal);
  const itemCount = useGroceryCart(selectCartItemCount);

  if (lines.length === 0) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text className="text-[17px] font-extrabold text-ink">Your cart</Text>
      <Text className="mt-0.5 text-[12.5px] text-ink-muted">{store?.name ?? ''} · {itemCount} item{itemCount === 1 ? '' : 's'}</Text>

      <View className="mt-4 max-h-[280px]">
        {lines.map((line) => (
          <View
            key={line.product.id}
            className="flex-row items-center gap-3 border-b border-line py-3"
          >
            <Text className="text-[20px]">{line.product.emoji}</Text>
            <View className="flex-1">
              <Text className="text-[13.5px] font-bold text-ink">{line.product.name}</Text>
              <Text className="text-[12px] text-ink-muted">
                {formatCurrency(line.product.price)} × {line.quantity}
              </Text>
            </View>
            <View className="flex-row items-center gap-2.5 rounded-full bg-surface-muted px-2 py-1">
              <Pressable onPress={() => decrement(line.product.id)} hitSlop={6} className="px-1">
                <Text className="text-[14px] font-bold text-ink-secondary">−</Text>
              </Pressable>
              <Text className="min-w-[16px] text-center text-[13px] font-bold text-ink">{line.quantity}</Text>
              <Pressable onPress={() => increment(line.product.id)} hitSlop={6} className="px-1">
                <Text className="text-[14px] font-bold text-primary">+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[14px] font-semibold text-ink-secondary">Subtotal</Text>
        <Text className="text-[17px] font-extrabold text-ink">{formatCurrency(subtotal)}</Text>
      </View>

      <View className="mt-4 gap-2.5">
        <Button
          label="Proceed to checkout"
          size="lg"
          fullWidth
          onPress={() => {
            onClose();
            navigation.navigate('GroceryCheckout');
          }}
        />
        <Button label="Keep shopping" variant="ghost" size="sm" fullWidth onPress={onClose} />
      </View>
    </BottomSheet>
  );
}