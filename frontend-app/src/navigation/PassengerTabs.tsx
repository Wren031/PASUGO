import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { TabBar } from '@/components/navigation/TabBar';
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
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => (
        <TabBar
          {...props}
          icons={icons}
          labels={{ Notifications: 'Alerts' }}
          centerAction={{
            icon: 'maximize',
            label: 'Scan to pay',
            onPress: () => props.navigation.getParent()?.navigate('ScanPay'),
          }}
        />
      )}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
