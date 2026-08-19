import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { TabBar } from '@/components/navigation/TabBar';
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
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => (
        <TabBar {...props} icons={icons} labels={{ Notifications: 'Alerts' }} />
      )}
    >
      <Tab.Screen name="Home" component={DriverDashboardScreen} />
      <Tab.Screen name="Trips" component={DriverTripsScreen} />
      <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
      <Tab.Screen name="Notifications" component={DriverNotificationsScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}
