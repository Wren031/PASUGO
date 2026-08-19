import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PassengerTabs } from './PassengerTabs';
import { SelectLocationScreen } from '@/features/passenger/booking/screens/SelectLocationScreen';
import { SearchDriverScreen } from '@/features/passenger/booking/screens/SearchDriverScreen';
import { PickRiderScreen } from '@/features/passenger/booking/screens/PickRiderScreen';
import { RiderProfileScreen } from '@/features/passenger/booking/screens/RiderProfileScreen';
import { DriverFoundScreen } from '@/features/passenger/booking/screens/DriverFoundScreen';
import { TripTrackingScreen } from '@/features/passenger/tracking/screens/TripTrackingScreen';
import { TripDetailsScreen } from '@/features/passenger/history/screens/TripDetailsScreen';
import { ReviewDriverScreen } from '@/features/passenger/reviews/screens/ReviewDriverScreen';
import { PaymentsScreen } from '@/features/passenger/payments/screens/PaymentsScreen';
import { AddPaymentMethodScreen } from '@/features/passenger/payments/screens/AddPaymentMethodScreen';
import { ScanPayScreen } from '@/features/passenger/payments/screens/ScanPayScreen';
import { ScanPayConfirmScreen } from '@/features/passenger/payments/screens/ScanPayConfirmScreen';
import { SavedPlacesScreen } from '@/features/passenger/saved-places/screens/SavedPlacesScreen';
import { EditProfileScreen } from '@/features/passenger/profile/screens/EditProfileScreen';
import { SettingsScreen } from '@/features/passenger/profile/screens/SettingsScreen';
import { RideBookingScreen } from '@/features/passenger/booking/screens/RideBookingScreen';
import { GroceryStoresScreen } from '@/features/passenger/grocery/screens/GroceryStoresScreen';
import { GroceryStoreScreen } from '@/features/passenger/grocery/screens/GroceryStoreScreen';
import { GroceryCheckoutScreen } from '@/features/passenger/grocery/screens/GroceryCheckoutScreen';
import { GroceryTrackingScreen } from '@/features/passenger/grocery/screens/GroceryTrackingScreen';
import { VerifyAccountScreen } from '@/features/passenger/verify/screens/VerifyAccountScreen';
import type { PassengerStackParamList } from './types';
import React from 'react';

const Stack = createNativeStackNavigator<PassengerStackParamList>();

export function PassengerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
      <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
      <Stack.Screen name="SearchDriver" component={SearchDriverScreen} />
      <Stack.Screen name="PickRider" component={PickRiderScreen} />
      <Stack.Screen name="RiderProfile" component={RiderProfileScreen} />
      <Stack.Screen name="DriverFound" component={DriverFoundScreen} />
      <Stack.Screen name="TripTracking" component={TripTrackingScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="ReviewDriver" component={ReviewDriverScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="RideBooking" component={RideBookingScreen} />
      <Stack.Screen name="GroceryStores" component={GroceryStoresScreen} />
      <Stack.Screen name="GroceryStore" component={GroceryStoreScreen} />
      <Stack.Screen name="GroceryCheckout" component={GroceryCheckoutScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ScanPay" component={ScanPayScreen} />
  <Stack.Screen name="ScanPayConfirm" component={ScanPayConfirmScreen} />
  <Stack.Screen name="GroceryTracking" component={GroceryTrackingScreen} options={{ gestureEnabled: false }} />
  <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
    </Stack.Navigator>
  );
}

