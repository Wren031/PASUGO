import { ActivityIndicator, Text, View } from 'react-native';
import { Logo } from '@/components/ui/Logo';

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-surface-muted">
      <Logo size="md" />
      <View className="items-center gap-2">
        <ActivityIndicator size="small" color="#F97316" />
        <Text className="text-[13px] text-ink-muted">{label}</Text>
      </View>
    </View>
  );
}
