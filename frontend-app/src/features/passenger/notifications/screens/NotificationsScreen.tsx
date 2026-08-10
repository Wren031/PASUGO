import { FlatList, Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/loaders/Skeleton';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import { useAuthStore, selectUser } from '@/store/auth-store';

export function NotificationsScreen() {
  const user = useAuthStore(selectUser);
  const userId = user?.id ?? '';
  const { data: notifications, isLoading } = useNotifications(userId);
  const markRead = useMarkNotificationRead(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        right={
          unreadCount > 0 ? (
            <Pressable
              onPress={() => markAllRead.mutate()}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 active:bg-slate-50"
            >
              <Text className="text-[12px] font-bold text-primary-dark">Mark all read</Text>
            </Pressable>
          ) : undefined
        }
      />
      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        data={notifications ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-4">
              <SkeletonList count={4} />
            </View>
          ) : (
            <EmptyState title="No notifications" message="Updates about your rides will appear here." icon="bell" />
          )
        }
        renderItem={({ item, index }) => (
          <View className={index > 0 ? 'mt-2.5' : 'mt-4'}>
            <NotificationCard
              type={item.type}
              title={item.title}
              message={item.message}
              createdAt={item.createdAt}
              read={item.read}
              onPress={() => {
                if (!item.read) markRead.mutate(item.id);
              }}
            />
          </View>
        )}
      />
    </Screen>
  );
}

