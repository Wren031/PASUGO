import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useToastStore } from '@/store/toast-store';

const toneStyles = {
  success: { icon: 'check-circle', color: '#22C55E', bg: 'bg-white' },
  error: { icon: 'alert-circle', color: '#EF4444', bg: 'bg-white' },
  info: { icon: 'info', color: '#3B82F6', bg: 'bg-white' },
} as const;

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timers = toasts.map((toast) => setTimeout(() => dismiss(toast.id), 3200));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <View className="absolute left-4 right-4 z-50" style={{ top: insets.top + 8 }} pointerEvents="box-none">
      {toasts.map((toast) => {
        const style = toneStyles[toast.type];
        return (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(220)}
            exiting={FadeOutUp.duration(180)}
            className="mb-2 flex-row items-center gap-3 rounded-xl border border-line bg-white px-4 py-3"
          >
            <Feather name={style.icon} size={18} color={style.color} />
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-ink">{toast.title}</Text>
              {toast.message ? <Text className="text-[12px] text-ink-secondary">{toast.message}</Text> : null}
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}
