import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PassengerStackParamList } from '@/navigation/types';
import { usePassengerProfile } from '@/features/passenger/dashboard/hooks/usePassengerDashboard';
import { selectUser, useAuthStore } from '@/store/auth-store';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function ServiceSelector() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger } = usePassengerProfile(user?.id ?? '');

  const isVerified = !passenger || passenger.identityVerified;

  const openRideBooking = () => {
    if (!isVerified) {
      navigation.navigate('VerifyAccount', { next: 'RideBooking' });
      return;
    }
    navigation.navigate('RideBooking');
  };

  const openGrocery = () => {
    if (!isVerified) {
      navigation.navigate('VerifyAccount', { next: 'GroceryStores' });
      return;
    }
    navigation.navigate('GroceryStores');
  };

  return (
    <View className="gap-3">
      <Pressable
        onPress={openRideBooking}
        className="flex-row items-center gap-4 rounded-2xl border border-primary/25 bg-primary-soft p-4 active:opacity-90"
      >
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
          <MaterialCommunityIcons name="motorbike" size={26} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-ink">Find Rider</Text>
          <Text className="mt-0.5 text-[12.5px] leading-4 text-ink-secondary">
            {isVerified
              ? 'Find a motorcycle or car rider and book your trip now.'
              : 'Verify your account to book a rider.'}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#C2410C" />
      </Pressable>

      <Pressable
        onPress={openGrocery}
        className="flex-row items-center gap-4 rounded-2xl border border-success/25 bg-success-soft p-4 active:opacity-90"
      >
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-success">
          <MaterialCommunityIcons name="cart" size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-ink">HatodGo Grocery</Text>
          <Text className="mt-0.5 text-[12.5px] leading-4 text-ink-secondary">
            {isVerified
              ? 'Order products from stores and have them delivered to your location.'
              : 'Verify your account to order groceries.'}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#16A34A" />
      </Pressable>
    </View>
  );
}
