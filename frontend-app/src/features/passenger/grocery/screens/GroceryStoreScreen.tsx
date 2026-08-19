import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { ProductRow } from '../components/ProductRow';
import { CartSheet } from '../components/CartSheet';
import { useStore } from '../hooks/useGrocery';
import { selectCartItemCount, selectCartSubtotal, useGroceryCart } from '../store/grocery-cart-store';
import { formatCurrency } from '@/utils/format';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Route = RouteProp<PassengerStackParamList, 'GroceryStore'>;

export function GroceryStoreScreen() {
  const route = useRoute<Route>();
  const { storeId } = route.params;
  const { data: store, isLoading } = useStore(storeId);
  const [cartVisible, setCartVisible] = useState(false);
  const itemCount = useGroceryCart(selectCartItemCount);
  const subtotal = useGroceryCart(selectCartSubtotal);

  const categories = useMemo(() => {
    if (!store) return [] as string[];
    return [...new Set(store.products.map((p) => p.category))];
  }, [store]);

  if (isLoading || !store) {
    return (
      <Screen>
        <ScreenHeader title="Store" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={store.name} subtitle={store.category} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          <View className="gap-1.5 border-b border-line bg-white px-4 py-4">
            <View className="flex-row items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted">
                <Text className="text-[30px]">{store.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-extrabold text-ink">{store.name}</Text>
                <Text className="mt-0.5 text-[12.5px] text-ink-muted">
                  {store.address}
                </Text>
              </View>
            </View>
            <View className="mt-1 flex-row flex-wrap gap-2">
              <Badge label={`${store.rating.toFixed(1)} ★`} tone="warning" />
              <Badge label={`${store.etaMin} min ETA`} tone="primary" />
              <Badge label={`${formatCurrency(store.deliveryFee)} delivery`} tone="neutral" />
            </View>
          </View>
        }
        renderItem={({ item: category }) => (
          <View>
            <View className="bg-surface-muted px-4 py-2">
              <Text className="text-[12.5px] font-bold uppercase tracking-wide text-ink-secondary">
                {category}
              </Text>
            </View>
            {store.products
              .filter((product) => product.category === category)
              .map((product) => (
                <ProductRow key={product.id} store={store} product={product} />
              ))}
          </View>
        )}
      />

      {itemCount > 0 ? (
        <Pressable
          onPress={() => setCartVisible(true)}
          className="absolute inset-x-4 bottom-6 flex-row items-center justify-between rounded-2xl bg-ink px-4 py-3.5 shadow-lg elevation-4 active:opacity-90"
        >
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Text className="text-[12px] font-bold text-white">{itemCount}</Text>
            </View>
            <Text className="text-[14px] font-bold text-white">View cart</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-white">
            {formatCurrency(subtotal)}
          </Text>
        </Pressable>
      ) : null}

      <CartSheet visible={cartVisible} onClose={() => setCartVisible(false)} />
    </Screen>
  );
}