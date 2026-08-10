import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore, selectRole } from '@/store/auth-store';
import { AuthNavigator } from './AuthNavigator';
import { PassengerNavigator } from './PassengerNavigator';
import { DriverNavigator } from './DriverNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const role = useAuthStore(selectRole);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      {role === 'passenger' ? (
        <Stack.Screen name="Passenger" component={PassengerNavigator} />
      ) : role === 'driver' ? (
        <Stack.Screen name="Driver" component={DriverNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
