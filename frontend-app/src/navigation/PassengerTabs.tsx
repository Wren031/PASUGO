import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { DashboardScreen } from '@/features/passenger/dashboard/screens/DashboardScreen';
import { TripsScreen } from '@/features/passenger/history/screens/TripsScreen';
import { NotificationsScreen } from '@/features/passenger/notifications/screens/NotificationsScreen';
import { ProfileScreen } from '@/features/passenger/profile/screens/ProfileScreen';
import type { PassengerTabParamList } from './types';

const Tab = createBottomTabNavigator<PassengerTabParamList>();

const icons: Record<keyof PassengerTabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Trips: 'list',
  Notifications: 'bell',
  Profile: 'user',
};

export function PassengerTabs() {
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
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
