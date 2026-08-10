import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { TripStatusStepper, type StepperStep } from '@/components/tracking/TripStatusStepper';
import { MapContainer } from '@/components/maps/MapContainer';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/buttons/Button';
import { useDriverRideSimulation } from '../hooks/useDriverRideSimulation';
import { useDriverStore } from '@/store/driver-store';
import { formatCurrency } from '@/utils/format';
import type { DriverStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<DriverStackParamList>;

const STEPS: StepperStep[] = [
  { key: 'going', label: 'Going', icon: 'motorbike' },
  { key: 'arrived', label: 'Arrived', icon: 'map-marker' },
  { key: 'on-trip', label: 'On trip', icon: 'road-variant' },
  { key: 'done', label: 'Done', icon: 'check' },
];

const phaseIndexMap: Record<string, number> = {
  'going-to-pickup': 0,
  arrived: 1,
  'on-trip': 2,
  completed: 3,
};

export function ActiveTripScreen() {
  const navigation = useNavigation<Navigation>();
  useDriverRideSimulation();

  const activeRequest = useDriverStore((state) => state.activeRequest);
  const phase = useDriverStore((state) => state.phase);
  const passengerPosition = useDriverStore((state) => state.passengerPosition);
  const route = useDriverStore((state) => state.route);
  const progress = useDriverStore((state) => state.progress);
  const etaMin = useDriverStore((state) => state.etaMin);
  const lastTripEarning = useDriverStore((state) => state.lastTripEarning);
  const resetTrip = useDriverStore((state) => state.resetTrip);

  const phaseIndex = phaseIndexMap[phase] ?? 0;
  const completed = phase === 'completed';

  const markers = useMemo(() => {
    const list = [];
    if (activeRequest) {
      if (!completed) {
        list.push({
          id: 'pickup',
          coordinate: activeRequest.pickupCoordinates,
          type: 'pickup' as const,
          label: activeRequest.pickup,
        });
        list.push({
          id: 'dropoff',
          coordinate: activeRequest.dropoffCoordinates,
          type: 'dropoff' as const,
          label: activeRequest.dropoff,
        });
      }
      if (passengerPosition) {
        list.push({
          id: 'driver',
          coordinate: passengerPosition,
          type: 'driver' as const,
          label: completed ? 'Dropoff' : 'You',
        });
      }
    }
    return list;
  }, [activeRequest, passengerPosition, completed]);

  const handleDone = () => {
    resetTrip();
    navigation.popToTop();
  };

  return (
    <Screen>
      <View className="h-[45%] w-full">
        <MapContainer route={route} markers={markers} className="h-full w-full" />
        <View className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-2">
          <Text className="text-[12px] font-bold text-ink">
            {completed ? 'Trip completed' : etaMin > 0 ? `ETA ~${etaMin} min` : 'You have arrived'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          <TripStatusStepper steps={STEPS} currentIndex={phaseIndex} />
        </View>

        {!completed && activeRequest ? (
          <>
            <View className="mt-4 rounded-2xl border border-line bg-white p-4">
              <View className="flex-row items-center gap-3">
                <Avatar name={activeRequest.passengerName} size="lg" showOnlineDot />
                <View className="flex-1">
                  <Text className="text-[15px] font-bold text-ink">{activeRequest.passengerName}</Text>
                  <View className="mt-0.5 flex-row items-center gap-2">
                    <RatingStars value={activeRequest.passengerRating} size={12} showValue />
                    <Text className="text-[11px] text-ink-muted">· {activeRequest.passengerPhone}</Text>
                  </View>
                </View>
                <Badge label={activeRequest.paymentMethod} tone="neutral" />
              </View>
            </View>

            <View className="mt-3 rounded-2xl border border-line bg-white p-4">
              <View className="flex-row">
                <View className="mr-3 items-center">
                  <View className="h-2.5 w-2.5 rounded-full bg-success" />
                  <View className="w-px flex-1 border-l border-dashed border-line" />
                  <View className="h-2.5 w-2.5 rounded-full bg-danger" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-ink">{activeRequest.pickup}</Text>
                  <Text className="mt-4 text-[14px] font-semibold text-ink">{activeRequest.dropoff}</Text>
                </View>
              </View>
              <View className="mt-3 flex-row gap-4 border-t border-line pt-3">
                <View>
                  <Text className="text-[11px] text-ink-muted">Distance</Text>
                  <Text className="text-[13px] font-bold text-ink">{activeRequest.distanceKm} km</Text>
                </View>
                <View>
                  <Text className="text-[11px] text-ink-muted">Fare</Text>
                  <Text className="text-[13px] font-extrabold text-primary-dark">
                    {formatCurrency(activeRequest.estimatedFare)}
                  </Text>
                </View>
                <View>
                  <Text className="text-[11px] text-ink-muted">Progress</Text>
                  <Text className="text-[13px] font-bold text-ink">{Math.round(progress * 100)}%</Text>
                </View>
              </View>
            </View>
          </>
        ) : lastTripEarning ? (
          <View className="mt-4 rounded-2xl border border-line bg-white p-5">
            <View className="items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-success-soft">
                <Feather name="check" size={24} color="#16A34A" />
              </View>
              <Text className="mt-2 text-[18px] font-extrabold text-ink">Trip completed</Text>
              <Text className="mt-0.5 text-[12px] text-ink-muted">{lastTripEarning.passengerName}</Text>
            </View>
            <View className="mt-5 gap-2.5">
              <EarningRow label="Fare" value={formatCurrency(lastTripEarning.fare)} />
              <EarningRow label="Commission" value={`-${formatCurrency(lastTripEarning.commission)}`} muted />
              <EarningRow label="Distance" value={`${lastTripEarning.distanceKm} km`} />
              <View className="flex-row items-center justify-between border-t border-line pt-3">
                <Text className="text-[15px] font-bold text-ink">You earned</Text>
                <Text className="text-[20px] font-extrabold text-success">+{formatCurrency(lastTripEarning.net)}</Text>
              </View>
            </View>
            <Button label="Done" size="lg" fullWidth className="mt-5" onPress={handleDone} />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function EarningRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[13px] text-ink-secondary">{label}</Text>
      <Text className={muted ? 'text-[13px] font-semibold text-ink-secondary' : 'text-[13px] font-semibold text-ink'}>
        {value}
      </Text>
    </View>
  );
}
