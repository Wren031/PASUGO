import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { DriverDashboardScreen } from '@/features/driver/dashboard/screens/DriverDashboardScreen';
import { DriverTripsScreen } from '@/features/driver/history/screens/DriverTripsScreen';
import { DriverEarningsScreen } from '@/features/driver/earnings/screens/DriverEarningsScreen';
import { DriverNotificationsScreen } from '@/features/driver/notifications/screens/DriverNotificationsScreen';
import { DriverProfileScreen } from '@/features/driver/profile/screens/DriverProfileScreen';
import type { DriverTabParamList } from './types';

const Tab = createBottomTabNavigator<DriverTabParamList>();

const icons: Record<keyof DriverTabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Trips: 'list',
  Earnings: 'bar-chart-2',
  Notifications: 'bell',
  Profile: 'user',
};

export function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Feather name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DriverDashboardScreen} />
      <Tab.Screen name="Trips" component={DriverTripsScreen} />
      <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
      <Tab.Screen name="Notifications" component={DriverNotificationsScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}
