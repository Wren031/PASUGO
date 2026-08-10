import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { colors } from '@/constants/theme';

interface RatingStarsProps {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  value,
  size = 16,
  interactive = false,
  onChange,
  showValue = false,
  className,
}: RatingStarsProps) {
  const renderStars = () =>
    [1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.round(value);
      return interactive ? (
        <Pressable key={star} onPress={() => onChange?.(star)} hitSlop={6}>
          <Ionicons
            name={filled ? 'star' : 'star-outline'}
            size={size + 6}
            color={filled ? '#F59E0B' : '#CBD5E1'}
          />
        </Pressable>
      ) : (
        <Ionicons
          key={star}
          name={filled ? 'star' : 'star-outline'}
          size={size}
          color={filled ? '#F59E0B' : '#CBD5E1'}
        />
      );
    });

  return (
    <View className={cn('flex-row items-center gap-0.5', className)}>
      {renderStars()}
      {showValue ? (
        <Text className="ml-1 text-[13px] font-semibold text-ink-secondary">
          {value.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}
