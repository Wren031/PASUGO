import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { LocationInput, type PickedLocation } from '@/components/inputs/LocationInput';
import { TextArea } from '@/components/inputs/TextArea';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { useAuthStore } from '@/store/auth-store';
import { usePassengerProfile } from '@/features/passenger/profile/hooks/usePassengerProfile';
import { selectCartSubtotal, useGroceryCart } from '../store/grocery-cart-store';
import { useCreateGroceryOrder } from '../hooks/useGrocery';
import type { GroceryOrderDraft, GroceryOrderItem } from '@/types/grocery';
import type { PaymentMethod } from '@/types/booking';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'GCash'];

export function GroceryCheckoutScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((state) => state.session?.user ?? null);
  const { data: profile } = usePassengerProfile(user?.id ?? '');
  const store = useGroceryCart((state) => state.store);
  const lines = useGroceryCart((state) => state.lines);
  const clearCart = useGroceryCart((state) => state.clear);
  const subtotal = useGroceryCart(selectCartSubtotal);

  const [address, setAddress] = useState<{ name: string; coordinates: PickedLocation['coordinates'] } | null>(null);
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [error, setError] = useState('');

  const createOrder = useCreateGroceryOrder();

  const deliveryFee = store?.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;

  const items = useMemo<GroceryOrderItem[]>(
    () =>
      lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
      })),
    [lines],
  );

  const handlePlaceOrder = () => {
    if (!store) return;
    if (!address) {
      setError('Please choose a delivery address');
      return;
    }
    const draft: GroceryOrderDraft = {
      passengerId: user?.id ?? '',
      storeId: store.id,
      storeName: store.name,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: address.name,
      deliveryCoordinates: address.coordinates,
      instructions: instructions.trim() || undefined,
      paymentMethod,
    };
    createOrder.mutate(draft, {
      onSuccess: (order) => {
        clearCart();
        navigation.replace('GroceryTracking', { orderId: order.id, storeId: store.id });
      },
    });
  };

  if (lines.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Checkout" />
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Feather name="shopping-cart" size={36} color="#CBD5E1" />
          <Text className="text-[14px] font-semibold text-ink-muted">Your cart is empty</Text>
          <Button label="Browse stores" size="sm" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Checkout" subtitle={store?.name ?? ''} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-5 p-4">
          <View className="rounded-2xl border border-line bg-white p-4">
            <Text className="mb-3 text-[14px] font-bold text-ink">Delivery address</Text>
            <LocationInput
              label="Where to deliver"
              value={address?.name ?? null}
              placeholder="Choose delivery location"
              savedPlaces={profile?.savedPlaces}
              target="dropoff"
              error={error}
              onSelect={(location: PickedLocation) => {
                setError('');
                setAddress({ name: location.name, coordinates: location.coordinates });
              }}
            />
          </View>

          <View className="rounded-2xl border border-line bg-white p-4">
            <Text className="mb-3 text-[14px] font-bold text-ink">Order summary</Text>
            {lines.map((line) => (
              <View key={line.product.id} className="flex-row items-center gap-2.5 py-1.5">
                <Text className="text-[16px]">{line.product.emoji}</Text>
                <Text className="flex-1 text-[13.5px] text-ink">
                  {line.product.name} <Text className="text-ink-muted">× {line.quantity}</Text>
                </Text>
                <Text className="text-[13.5px] font-semibold text-ink">
                  {formatCurrency(line.product.price * line.quantity)}
                </Text>
              </View>
            ))}
            <View className="mt-2 border-t border-line pt-3">
              <View className="flex-row justify-between py-0.5">
                <Text className="text-[13px] text-ink-muted">Subtotal</Text>
                <Text className="text-[13px] font-semibold text-ink">{formatCurrency(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between py-0.5">
                <Text className="text-[13px] text-ink-muted">Delivery fee</Text>
                <Text className="text-[13px] font-semibold text-ink">{formatCurrency(deliveryFee)}</Text>
              </View>
              <View className="mt-1 flex-row justify-between border-t border-line pt-2.5">
                <Text className="text-[14px] font-bold text-ink">Total</Text>
                <Text className="text-[16px] font-extrabold text-primary-dark">{formatCurrency(total)}</Text>
              </View>
            </View>
          </View>

          <View className="rounded-2xl border border-line bg-white p-4">
            <Text className="mb-3 text-[14px] font-bold text-ink">Payment method</Text>
            <View className="flex-row gap-3">
              {PAYMENT_METHODS.map((method) => (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className={cn(
                    'flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3',
                    paymentMethod === method ? 'border-primary bg-primary-soft' : 'border-line bg-white',
                  )}
                >
                  <Feather
                    name={paymentMethod === method ? 'check-circle' : 'circle'}
                    size={16}
                    color={paymentMethod === method ? '#C2410C' : '#94A3B8'}
                  />
                  <Text
                    className={cn(
                      'text-[13px] font-bold',
                      paymentMethod === method ? 'text-primary-dark' : 'text-ink-secondary',
                    )}
                  >
                    {method}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="rounded-2xl border border-line bg-white p-4">
            <TextArea
              label="Delivery instructions (optional)"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Leave at the gate, call when you arrive"
            />
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-line bg-white px-4 pb-5 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[13px] text-ink-muted">Total</Text>
          <Text className="text-[18px] font-extrabold text-ink">{formatCurrency(total)}</Text>
        </View>
        <Button
          label={createOrder.isPending ? 'Placing order…' : 'Place order'}
          size="lg"
          fullWidth
          disabled={createOrder.isPending}
          onPress={handlePlaceOrder}
        />
        {createOrder.isError ? (
          <Text className="mt-2 text-center text-[12.5px] text-danger">Failed to place order. Try again.</Text>
        ) : null}
      </View>
    </Screen>
  );
}