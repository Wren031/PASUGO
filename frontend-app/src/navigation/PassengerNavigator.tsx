import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PassengerTabs } from './PassengerTabs';
import { SelectLocationScreen } from '@/features/passenger/booking/screens/SelectLocationScreen';
import { SearchDriverScreen } from '@/features/passenger/booking/screens/SearchDriverScreen';
import { DriverFoundScreen } from '@/features/passenger/booking/screens/DriverFoundScreen';
import { TripTrackingScreen } from '@/features/passenger/tracking/screens/TripTrackingScreen';
import { TripDetailsScreen } from '@/features/passenger/history/screens/TripDetailsScreen';
import { ReviewDriverScreen } from '@/features/passenger/reviews/screens/ReviewDriverScreen';
import { PaymentsScreen } from '@/features/passenger/payments/screens/PaymentsScreen';
import { AddPaymentMethodScreen } from '@/features/passenger/payments/screens/AddPaymentMethodScreen';
import { SavedPlacesScreen } from '@/features/passenger/saved-places/screens/SavedPlacesScreen';
import { EditProfileScreen } from '@/features/passenger/profile/screens/EditProfileScreen';
import { SettingsScreen } from '@/features/passenger/profile/screens/SettingsScreen';
import type { PassengerStackParamList } from './types';

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
      <Stack.Screen name="DriverFound" component={DriverFoundScreen} />
      <Stack.Screen name="TripTracking" component={TripTrackingScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="ReviewDriver" component={ReviewDriverScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
