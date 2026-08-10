import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { timeAgo } from '@/utils/format';
import type { NotificationType } from '@/types/notification';
import { cn } from '@/utils/cn';

const typeStyle: Record<NotificationType, { icon: keyof typeof MaterialCommunityIcons.glyphMap; bg: string; color: string }> = {
  booking: { icon: 'motorbike', bg: 'bg-info-soft', color: '#3B82F6' },
  'ride-request': { icon: 'bell-ring-outline', bg: 'bg-primary-soft', color: '#F97316' },
  earning: { icon: 'bank-outline', bg: 'bg-success-soft', color: '#22C55E' },
  promotion: { icon: 'tag-outline', bg: 'bg-warning-soft', color: '#F59E0B' },
  system: { icon: 'bullhorn-outline', bg: 'bg-slate-100', color: '#64748B' },
};

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  onPress?: () => void;
}

export function NotificationCard({ type, title, message, createdAt, read, onPress }: NotificationCardProps) {
  const style = typeStyle[type];
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row gap-3 border-b border-line bg-white px-4 py-4 active:bg-slate-50',
        !read && 'bg-primary-soft',
      )}
    >
      <View className={cn('h-10 w-10 items-center justify-center rounded-full', style.bg)}>
        <MaterialCommunityIcons name={style.icon} size={20} color={style.color} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className={cn('flex-1 text-[14px]', read ? 'font-semibold text-ink' : 'font-bold text-ink')}>
            {title}
          </Text>
          {!read ? <View className="mt-1 h-2 w-2 rounded-full bg-primary" /> : null}
        </View>
        <Text className="mt-1 text-[13px] leading-5 text-ink-secondary">{message}</Text>
        <Text className="mt-1.5 text-[11px] text-ink-muted">{timeAgo(createdAt)}</Text>
      </View>
    </Pressable>
  );
}
