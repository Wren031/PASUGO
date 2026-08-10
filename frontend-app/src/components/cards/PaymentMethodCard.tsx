import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { PaymentMethod } from '@/types/booking';
import type { PaymentMethodInfo } from '@/types/payment';

const methodIcon: Record<PaymentMethod, { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  Cash: { icon: 'cash-multiple', color: '#22C55E' },
  GCash: { icon: 'cellphone', color: '#3B82F6' },
  Card: { icon: 'credit-card-outline', color: '#8B5CF6' },
  Wallet: { icon: 'wallet-outline', color: '#F97316' },
};

interface PaymentMethodCardProps {
  method: PaymentMethodInfo;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function PaymentMethodCard({ method, selected = false, onPress, className }: PaymentMethodCardProps) {
  const { icon, color } = methodIcon[method.method];
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-2xl border bg-white p-4 active:bg-slate-50',
        selected ? 'border-primary bg-primary-soft' : 'border-line',
        className,
      )}
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-[15px] font-bold text-ink">{method.label}</Text>
          {method.isDefault ? <Badge label="Default" tone="primary" /> : null}
        </View>
        <Text className="mt-0.5 text-[13px] text-ink-muted">{method.details}</Text>
      </View>
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border-2',
          selected ? 'border-primary bg-primary' : 'border-line bg-white',
        )}
      >
        {selected ? <View className="h-2 w-2 rounded-full bg-white" /> : null}
      </View>
    </Pressable>
  );
}
