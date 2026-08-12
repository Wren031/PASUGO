import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation, type CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useDriverProfile } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { useDriverStore } from '@/store/driver-store';
import { formatCurrency, formatDate } from '@/utils/format';
import type { DriverStackParamList, DriverTabParamList } from '@/navigation/types';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList, 'Profile'>,
  NativeStackNavigationProp<DriverStackParamList>
>;

export function DriverProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((state) => state.logout);
  const { data: driver } = useDriverProfile(user?.id ?? '');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const menuItems: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }[] = [
    { icon: 'edit-2', label: 'Edit profile', onPress: () => navigation.navigate('DriverEditProfile') },
    { icon: 'truck', label: 'Vehicle & documents', onPress: () => navigation.navigate('DriverVehicle') },
    { icon: 'bar-chart-2', label: 'Earnings', onPress: () => navigation.navigate('Earnings') },
    { icon: 'list', label: 'Trip history', onPress: () => navigation.navigate('Trips') },
    { icon: 'star', label: 'Reviews', onPress: () => navigation.navigate('DriverReviews') },
    { icon: 'bell', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
  ];

  return (
    <Screen>
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 items-center rounded-2xl border border-line bg-white p-6">
          <Avatar name={user?.name ?? 'Driver'} size="xl" />
          <Text className="mt-3 text-[18px] font-extrabold text-ink">{user?.name}</Text>
          {driver ? (
            <View className="mt-1 flex-row items-center gap-2">
              <RatingStars value={driver.rating} size={13} showValue />
              <Badge label={`${driver.totalTrips} trips`} tone="info" />
              <Badge label={driver.availability} tone={driver.availability === 'Available' ? 'success' : 'neutral'} />
            </View>
          ) : null}
          <View className="mt-4 w-full flex-row gap-3">
            <ProfileStat label="Total earnings" value={driver ? formatCurrency(driver.totalEarnings) : '—'} flex />
            <ProfileStat label="Member since" value={driver ? formatDate(driver.joinedAt) : '—'} flex />
          </View>
        </View>

        {driver ? (
          <View className="mt-4 rounded-2xl border border-line bg-white p-4">
            <Text className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Motorcycle</Text>
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                <MaterialCommunityIcons name="motorbike" size={22} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">
                  {driver.motorcycle.brand} {driver.motorcycle.model}
                </Text>
                <Text className="mt-0.5 text-[12px] text-ink-muted">
                  {driver.motorcycle.year} · {driver.motorcycle.color} · {driver.motorcycle.plateNumber}
                </Text>
              </View>
            </View>
            <View className="mt-3 flex-row gap-2 border-t border-line pt-3">
              <Badge label={`${driver.totalDistanceKm} km driven`} tone="neutral" />
              <Badge label={`${driver.yearsExperience} yrs exp`} tone="neutral" />
            </View>
          </View>
        ) : null}

        <View className="mt-4 rounded-2xl border border-line bg-white">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center gap-3 px-4 py-4 active:bg-slate-50 ${index > 0 ? 'border-t border-line' : ''}`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                <Feather name={item.icon} size={16} color="#64748B" />
              </View>
              <Text className="flex-1 text-[14px] font-semibold text-ink">{item.label}</Text>
              <Feather name="chevron-right" size={17} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setLogoutOpen(true)}
          className="mt-4 flex-row items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-4 active:opacity-80"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-danger">
            <Feather name="log-out" size={16} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-danger">Sign out</Text>
            <Text className="mt-0.5 text-[12px] text-red-700">End your session on this device</Text>
          </View>
        </Pressable>

        <Text className="mt-6 text-center text-[11px] text-ink-muted">HatodGo Driver v1.0.0</Text>
      </ScrollView>

      <ConfirmDialog
        visible={logoutOpen}
        title="Sign out?"
        message="You will stop receiving ride requests."
        confirmLabel="Sign out"
        tone="danger"
        icon={<Feather name="log-out" size={24} color="#EF4444" />}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          useDriverStore.getState().setOnline(false);
          logout();
        }}
      />
    </Screen>
  );
}

function ProfileStat({ label, value, flex }: { label: string; value: string; flex?: boolean }) {
  return (
    <View className={`${flex ? 'flex-1' : ''} rounded-2xl bg-surface-muted px-4 py-3.5`}>
      <Text className="text-[11px] text-ink-muted">{label}</Text>
      <Text className="mt-1 text-[14px] font-bold text-ink">{value}</Text>
    </View>
  );
}
