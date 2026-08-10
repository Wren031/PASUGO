import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverTabs } from './DriverTabs';
import { RideRequestScreen } from '@/features/driver/trip/screens/RideRequestScreen';
import { ActiveTripScreen } from '@/features/driver/trip/screens/ActiveTripScreen';
import { VehicleScreen } from '@/features/driver/vehicle/screens/VehicleScreen';
import { DriverReviewsScreen } from '@/features/driver/reviews/screens/DriverReviewsScreen';
import { DriverEditProfileScreen } from '@/features/driver/profile/screens/DriverEditProfileScreen';
import type { DriverStackParamList } from './types';

const Stack = createNativeStackNavigator<DriverStackParamList>();

export function DriverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="RideRequest" component={RideRequestScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="DriverVehicle" component={VehicleScreen} />
      <Stack.Screen name="DriverReviews" component={DriverReviewsScreen} />
      <Stack.Screen name="DriverEditProfile" component={DriverEditProfileScreen} />
    </Stack.Navigator>
  );
}
