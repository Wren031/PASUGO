import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons/IconButton';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, subtitle, right, onBack, showBack = true }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const handleBack = onBack ?? (() => navigation.goBack());

  return (
    <View className="flex-row items-center justify-between border-b border-line bg-white px-4 py-3.5">
      <View className="flex-1 flex-row items-center">
        {showBack && canGoBack && (
          <IconButton
            icon={<Feather name="chevron-left" size={24} color="#0F172A" />}
            onPress={handleBack}
            className="mr-1 -ml-2"
          />
        )}
        <View className="flex-1">
          {title ? <Text className="text-[18px] font-bold text-ink">{title}</Text> : null}
          {subtitle ? <Text className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
}
