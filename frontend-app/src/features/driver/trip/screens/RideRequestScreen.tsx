import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/buttons/Button';
import { buildDriverRoute } from '../services/trip-service';
import { useDriverStore } from '@/store/driver-store';
import { useDriverProfile } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { formatCurrency } from '@/utils/format';
import type { DriverStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<DriverStackParamList>;

export function RideRequestScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const { data: driver } = useDriverProfile(user?.id ?? '');
  const incomingRequest = useDriverStore((state) => state.incomingRequest);
  const acceptRequest = useDriverStore((state) => state.acceptRequest);
  const rejectRequest = useDriverStore((state) => state.rejectRequest);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!incomingRequest) return;
    setSecondsLeft(Math.max(0, Math.ceil((new Date(incomingRequest.expiresAt).getTime() - Date.now()) / 1000)));
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          rejectRequest();
          navigation.goBack();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingRequest, rejectRequest, navigation]);

  useEffect(() => {
    if (!incomingRequest) {
      navigation.goBack();
    }
  }, [incomingRequest, navigation]);

  if (!incomingRequest) return null;

  const handleAccept = () => {
    const plan = buildDriverRoute(incomingRequest, driver?.currentLocation ?? incomingRequest.pickupCoordinates);
    acceptRequest(plan.route, plan.etaMin);
    navigation.replace('ActiveTrip');
  };

  const handleDecline = () => {
    rejectRequest();
    navigation.goBack();
  };

  return (
    <Screen>
      <View className="flex-1 px-4 pb-6">
        <View className="mt-4 items-center">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Feather name="bell" size={22} color="#F97316" />
          </View>
          <Text className="mt-3 text-[20px] font-extrabold text-ink">New ride request</Text>
          <Text className="mt-1 text-[12px] text-ink-muted">
            Respond in {secondsLeft}s before it expires
          </Text>
          <View className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(secondsLeft / 30) * 100}%` }}
            />
          </View>
        </View>

        <View className="mt-6 rounded-2xl border border-line bg-white p-4">
          <View className="flex-row items-center gap-3">
            <Avatar name={incomingRequest.passengerName} size="lg" />
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">{incomingRequest.passengerName}</Text>
              <View className="mt-0.5 flex-row items-center gap-2">
                <RatingStars value={incomingRequest.passengerRating} size={12} showValue />
                <Badge label={`${incomingRequest.passengerTrips} trips`} tone="info" />
              </View>
            </View>
            <Badge label={incomingRequest.paymentMethod} tone="neutral" />
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-line bg-white p-4">
          <View className="flex-row">
            <View className="mr-3 items-center">
              <View className="h-2.5 w-2.5 rounded-full bg-success" />
              <View className="w-px flex-1 border-l border-dashed border-line" />
              <View className="h-2.5 w-2.5 rounded-full bg-danger" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">{incomingRequest.pickup}</Text>
              <Text className="mt-5 text-[15px] font-bold text-ink">{incomingRequest.dropoff}</Text>
            </View>
          </View>
          <View className="mt-3 flex-row gap-4 border-t border-line pt-3">
            <View>
              <Text className="text-[11px] text-ink-muted">Distance</Text>
              <Text className="text-[13px] font-bold text-ink">{incomingRequest.distanceKm} km</Text>
            </View>
            <View>
              <Text className="text-[11px] text-ink-muted">Duration</Text>
              <Text className="text-[13px] font-bold text-ink">~{incomingRequest.durationMin} min</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-[11px] text-ink-muted">Estimated fare</Text>
              <Text className="text-[15px] font-extrabold text-primary-dark">
                {formatCurrency(incomingRequest.estimatedFare)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1" />
        <View className="flex-row gap-3">
          <Button label="Decline" variant="danger" className="flex-1" onPress={handleDecline} />
          <Button label="Accept" size="lg" className="flex-1" onPress={handleAccept} />
        </View>
      </View>
    </Screen>
  );
}
