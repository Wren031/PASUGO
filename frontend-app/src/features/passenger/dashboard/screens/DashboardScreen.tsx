import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { GreetingHeader } from '../components/GreetingHeader';
import { PromoBanner } from '../components/PromoBanner';
import { BookingCard } from '../components/BookingCard';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { usePassengerProfile } from '../hooks/usePassengerDashboard';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { useRideStore } from '@/store/ride-store';
import { formatCurrency } from '@/utils/format';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: passenger, isLoading } = usePassengerProfile(user?.id ?? '');
  const ride = useRideStore((state) => state.booking);
  const ridePhase = useRideStore((state) => state.phase);
  const driver = useRideStore((state) => state.driver);
  const hasActiveRide =
    Boolean(ride) && !['completed', 'cancelled'].includes(ridePhase);

  if (isLoading || !passenger || !user) {
    return (
      <Screen contentClassName="px-4">
        <View className="gap-4">
          <GreetingHeader name={user?.name ?? 'Rider'} rating={0} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentClassName="px-4 pb-8 pt-4 gap-5">
      <GreetingHeader name={passenger.name} rating={passenger.rating} />

      {hasActiveRide && ride && driver ? (
        <Card variant="primary-soft">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Feather name="navigation" size={18} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-ink">Active ride to {ride.dropoff}</Text>
              <Text className="text-[12px] text-ink-secondary">
                {ridePhase === 'in-trip' ? 'Trip in progress' : 'Driver en route'} · {formatCurrency(ride.fare.total)}
              </Text>
            </View>
            <Button
              label="Track"
              size="sm"
              onPress={() => navigation.navigate('TripTracking', { booking: ride, driver })}
            />
          </View>
        </Card>
      ) : null}

      <PromoBanner />

      <BookingCard
        userId={passenger.id}
        userName={passenger.name}
        userPhone={passenger.phone}
        savedPlaces={passenger.savedPlaces}
      />
    </Screen>
  );
}
