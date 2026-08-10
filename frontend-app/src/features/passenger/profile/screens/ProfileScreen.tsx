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
import { usePassengerProfile } from '../hooks/usePassengerProfile';
import { selectUser, useAuthStore } from '@/store/auth-store';
import { formatCurrency, formatDate } from '@/utils/format';
import type { PassengerStackParamList, PassengerTabParamList } from '@/navigation/types';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<PassengerTabParamList, 'Profile'>,
  NativeStackNavigationProp<PassengerStackParamList>
>;

export function ProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((state) => state.logout);
  const { data: passenger, isLoading } = usePassengerProfile(user?.id ?? '');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const rows: { icon: keyof typeof Feather.glyphMap; label: string; value: string }[] = [
    { icon: 'phone', label: 'Mobile number', value: user?.phone ?? '' },
    { icon: 'mail', label: 'Email', value: user?.email ?? '' },
    { icon: 'home', label: 'Home', value: passenger?.homeLocation ?? 'Not set' },
    { icon: 'briefcase', label: 'Work', value: passenger?.workLocation ?? 'Not set' },
  ];

  const menuItems: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void; danger?: boolean }[] = [
    { icon: 'user', label: 'Edit profile', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'map-pin', label: 'Saved places', onPress: () => navigation.navigate('SavedPlaces') },
    { icon: 'credit-card', label: 'Payment methods', onPress: () => navigation.navigate('Payments') },
    { icon: 'bell', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: 'settings', label: 'Settings', onPress: () => navigation.navigate('Settings') },
    { icon: 'log-out', label: 'Sign out', onPress: () => setLogoutOpen(true), danger: true },
  ];

  return (
    <Screen>
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 items-center rounded-2xl border border-line bg-white p-6">
          <Avatar name={user?.name ?? 'User'} size="xl" />
          <Text className="mt-3 text-[20px] font-extrabold tracking-tight text-ink">{user?.name}</Text>
          {passenger ? (
            <View className="mt-1 flex-row items-center gap-2">
              <RatingStars value={passenger.rating} size={13} showValue />
              <Badge label={`${passenger.totalBookings} trips`} tone="info" />
              <Badge label={passenger.identityVerified ? 'Verified' : 'Unverified'} tone={passenger.identityVerified ? 'success' : 'warning'} />
            </View>
          ) : null}
          <View className="mt-4 w-full flex-row gap-3">
            <Stat label="Total spent" value={passenger ? formatCurrency(passenger.totalSpent) : '—'} flex />
            <Stat label="Member since" value={user ? formatDate(user.createdAt) : '—'} flex />
          </View>
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Details</Text>
        <View className="rounded-2xl border border-line bg-white">
          {rows.map((row, index) => (
            <View key={row.label} className={`flex-row items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-line' : ''}`}>
              <Feather name={row.icon} size={17} color="#64748B" />
              <View className="flex-1">
                <Text className="text-[11px] text-ink-muted">{row.label}</Text>
                <Text className="mt-0.5 text-[14px] font-semibold text-ink">{row.value}</Text>
              </View>
              {row.label === 'Home' || row.label === 'Work' ? (
                <Pressable onPress={() => navigation.navigate('SavedPlaces')} className="rounded-full p-2 active:bg-slate-100">
                  <Feather name="edit-2" size={15} color="#F97316" />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Menu</Text>
        <View className="rounded-2xl border border-line bg-white">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center gap-3 px-4 py-4 active:bg-slate-50 ${index > 0 ? 'border-t border-line' : ''}`}
            >
              <Feather name={item.icon} size={17} color={item.danger ? '#EF4444' : '#64748B'} />
              <Text className={`flex-1 text-[14px] font-semibold ${item.danger ? 'text-danger' : 'text-ink'}`}>{item.label}</Text>
              <Feather name="chevron-right" size={17} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>

        <View className="mt-6 items-center">
          <MaterialCommunityIcons name="motorbike" size={18} color="#94A3B8" />
          <Text className="mt-1 text-[11px] text-ink-muted">HatodGo v1.0.0 · HatodGo Philippines</Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={logoutOpen}
        title="Sign out?"
        message="You will need to sign in again to book a ride."
        confirmLabel="Sign out"
        tone="danger"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />
    </Screen>
  );
}

function Stat({ label, value, flex }: { label: string; value: string; flex?: boolean }) {
  return (
    <View className={`${flex ? 'flex-1' : ''} rounded-2xl bg-surface-muted px-4 py-3.5`}>
      <Text className="text-[11px] text-ink-muted">{label}</Text>
      <Text className="mt-1 text-[14px] font-bold text-ink">{value}</Text>
    </View>
  );
}
