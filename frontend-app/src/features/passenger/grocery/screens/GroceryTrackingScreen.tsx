import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { MapContainer } from '@/components/maps/MapContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useGroceryOrderSimulation } from '../hooks/useGroceryOrderSimulation';
import { useStore } from '../hooks/useGrocery';
import type { PassengerStackParamList } from '@/navigation/types';
import type { GroceryOrder } from '@/types/grocery';
import React from 'react';

type Route = RouteProp<PassengerStackParamList, 'GroceryTracking'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const STATUS_STEPS: { status: GroceryOrder['status']; label: string; icon: 'clipboard-check' | 'storefront' | 'bike-fast' | 'bike' | 'package-variant' }[] = [
  { status: 'Preparing', label: 'Confirmed', icon: 'clipboard-check' },
  { status: 'Rider Assigned', label: 'Preparing', icon: 'storefront' },
  { status: 'On the Way', label: 'On the way', icon: 'bike-fast' },
  { status: 'Delivered', label: 'Delivered', icon: 'package-variant' },
];

function currentStepIndex(status: GroceryOrder['status']): number {
  const map: Record<GroceryOrder['status'], number> = {
    Preparing: 0,
    'Rider Assigned': 1,
    'On the Way': 2,
    Delivered: 3,
    Cancelled: 0,
  };
  return map[status] ?? 0;
}

export function GroceryTrackingScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { orderId, storeId } = route.params;
  const { data: store } = useStore(storeId);

  const { order, riderPosition, route: tripRoute, etaMin } = useGroceryOrderSimulation(
    orderId,
    store?.location ?? null,
  );

  const markers = useMemo(() => {
    if (!order) return [];
    return [
      { id: 'pickup', type: 'pickup' as const, coordinate: store?.location ?? order.deliveryCoordinates },
      { id: 'dropoff', type: 'dropoff' as const, coordinate: order.deliveryCoordinates },
      ...(riderPosition ? [{ id: 'rider', type: 'driver' as const, coordinate: riderPosition }] : []),
    ];
  }, [order, store, riderPosition]);

  if (!order) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-[14px] text-ink-muted">Loading order…</Text>
        </View>
      </Screen>
    );
  }

  const stepIndex = currentStepIndex(order.status);
  const delivered = order.status === 'Delivered';

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="px-4 pt-3">
          <View className="h-48 overflow-hidden rounded-3xl">
            <MapContainer route={tripRoute} markers={markers} className="h-full w-full" />
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-line bg-white p-4">
          <Text className="mb-3 text-center text-[12px] font-bold uppercase tracking-wide text-ink-muted">
            {delivered ? 'Order delivered' : 'Order status'}
          </Text>
          <View className="flex-row items-start justify-between px-1">
            {STATUS_STEPS.map((step, index) => {
              const isDone = index < stepIndex || delivered;
              const isCurrent = index === stepIndex && !delivered;
              return (
                <View key={step.status} className="flex-1 items-center gap-1.5">
                  <View
                    className={cn(
                      'h-9 w-9 items-center justify-center rounded-full',
                      isDone ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-surface-muted',
                    )}
                  >
                    <MaterialCommunityIcons
                      name={isDone ? 'check' : step.icon}
                      size={16}
                      color={isDone || isCurrent ? '#FFFFFF' : '#94A3B8'}
                    />
                  </View>
                  <Text
                    className={cn(
                      'text-center text-[10.5px] font-semibold',
                      isDone || isCurrent ? 'text-ink' : 'text-ink-muted',
                    )}
                  >
                    {step.label}
                  </Text>
                  {index < STATUS_STEPS.length - 1 ? (
                    <View className="absolute left-[60%] top-[17px] h-0.5 w-[80%] bg-line" />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-4 gap-4 px-4 pb-8">
          <View className="rounded-3xl border border-line bg-white p-4">
            <View className="flex-row items-center gap-3">
              <Avatar name={order.rider?.name ?? ''} size="md" showOnlineDot={Boolean(order.rider)} />
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">
                  {order.rider ? order.rider.name : 'Looking for a rider…'}
                </Text>
                <Text className="mt-0.5 text-[12px] text-ink-muted">
                  {order.rider
                    ? `${order.rider.vehicleLabel} · ${order.rider.plateNumber}`
                    : 'Assigning the nearest available rider'}
                </Text>
              </View>
              {order.rider ? (
                <Button
                  label="Call"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Feather name="phone" size={14} color="#F97316" />}
                  onPress={() => undefined}
                />
              ) : null}
            </View>
          </View>

          <View className="rounded-3xl border border-line bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[14px] font-bold text-ink">{order.storeName}</Text>
              <Badge label={order.status} tone={delivered ? 'success' : 'primary'} />
            </View>
            <Text className="mt-1 text-[12px] text-ink-muted">Deliver to {order.deliveryAddress}</Text>
            {order.instructions ? (
              <Text className="mt-2 rounded-xl bg-surface-muted px-3 py-2 text-[12px] text-ink-secondary">
                📝 {order.instructions}
              </Text>
            ) : null}
            <View className="mt-3 border-t border-line pt-3">
              {order.items.map((item) => (
                <View key={item.productId} className="flex-row justify-between py-0.5">
                  <Text className="flex-1 text-[13px] text-ink">
                    {item.name} <Text className="text-ink-muted">× {item.quantity}</Text>
                  </Text>
                  <Text className="text-[13px] font-semibold text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
              <View className="mt-1 flex-row justify-between border-t border-line pt-2.5">
                <Text className="text-[13px] text-ink-muted">Total</Text>
                <Text className="text-[14px] font-extrabold text-ink">{formatCurrency(order.total)}</Text>
              </View>
            </View>
          </View>

          <View className="rounded-3xl border border-line bg-white p-4">
            <Text className="mb-2.5 text-[14px] font-bold text-ink">Timeline</Text>
            {order.timeline.map((event) => (
              <View key={event.id} className="flex-row gap-3">
                <View className="items-center">
                  <View
                    className={cn(
                      'mt-1 h-2.5 w-2.5 rounded-full',
                      event.status === 'done' ? 'bg-success' : event.status === 'current' ? 'bg-primary' : 'bg-slate-200',
                    )}
                  />
                  {event.id !== order.timeline[order.timeline.length - 1].id ? (
                    <View className="w-0.5 flex-1 bg-slate-200" style={{ minHeight: 24 }} />
                  ) : null}
                </View>
                <View className="pb-3.5">
                  <Text className="text-[13px] font-semibold text-ink">{event.label}</Text>
                  {event.description ? (
                    <Text className="mt-0.5 text-[11.5px] text-ink-muted">{event.description}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          {delivered ? (
            <Button
              label="Done"
              size="lg"
              fullWidth
              onPress={() => navigation.popToTop()}
            />
          ) : (
            <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary-soft px-4 py-3">
              <MaterialCommunityIcons name="bike-fast" size={18} color="#C2410C" />
              <Text className="text-[13px] font-semibold text-primary-dark">
                {order.status === 'On the Way'
                  ? `Arriving in about ${Math.max(etaMin, 1)} min`
                  : 'Your order is being processed'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}