import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Input } from '@/components/inputs/Input';
import { StoreCard } from '../components/StoreCard';
import { useStores } from '../hooks/useGrocery';
import { SkeletonCard } from '@/components/loaders/Skeleton';
import { useGroceryCart } from '../store/grocery-cart-store';
import type { GroceryStore } from '@/types/grocery';
import type { PassengerStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function GroceryStoresScreen() {
  const navigation = useNavigation<Navigation>();
  const [query, setQuery] = useState('');
  const { data: stores, isLoading } = useStores(query);
  const clearCart = useGroceryCart((state) => state.clear);

  const openStore = (store: GroceryStore) => {
    clearCart();
    navigation.navigate('GroceryStore', { storeId: store.id });
  };

  return (
    <Screen>
      <ScreenHeader
        title="HatodGo Grocery"
        subtitle="Order from your favorite stores"
      />
      <View className="px-4 pb-2 pt-3">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search stores"
          leftIcon={<Feather name="search" size={18} color="#94A3B8" />}
        />
      </View>

      {isLoading ? (
        <View className="gap-3 px-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4, paddingBottom: 32, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text className="py-10 text-center text-[13px] text-ink-muted">
              No stores found for “{query}”
            </Text>
          }
          renderItem={({ item }) => (
            <StoreCard store={item} onPress={() => openStore(item)} />
          )}
        />
      )}
    </Screen>
  );
}