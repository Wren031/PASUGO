import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Input } from '@/components/inputs/Input';
import { Button } from '@/components/buttons/Button';
import { useAddPaymentMethod } from '../hooks/usePayments';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { PaymentMethod } from '@/types/booking';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const methodToPayment: Record<string, PaymentMethod> = {
  card: 'Card',
  gcash: 'GCash',
  maya: 'GCash',
  cash: 'Cash',
};

const methodOptions = [
  { id: 'card', label: 'Credit / Debit card', icon: 'credit-card' },
  { id: 'gcash', label: 'GCash', icon: 'smartphone' },
  { id: 'maya', label: 'Maya', icon: 'smartphone' },
  { id: 'cash', label: 'Cash', icon: 'banknote' },
] as const;

const cardBrands = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'amex', label: 'Amex' },
] as const;

export function AddPaymentMethodScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const addMethod = useAddPaymentMethod(user?.id ?? '');

  const [type, setType] = useState<(typeof methodOptions)[number]['id']>('card');
  const [brand, setBrand] = useState<(typeof cardBrands)[number]['id']>('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');
  const [walletNumber, setWalletNumber] = useState('');

  const handleSave = () => {
    if (type === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length < 12 || !/^\d+$/.test(digits)) {
        showToast('error', 'Invalid card number');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        showToast('error', 'Invalid expiry (MM/YY)');
        return;
      }
    } else if (walletNumber.replace(/\D/g, '').length < 10) {
      showToast('error', 'Enter a valid mobile number');
      return;
    }

    addMethod.mutate(
      {
        method: methodToPayment[type] ?? 'Card',
        label: type === 'card' ? `Card •••• ${digitsOrFallback()}` : `${labelOf(type)} ${maskWallet()}`,
        details: type === 'card' ? brand : 'Mobile wallet',
        isDefault: false,
      },
      {
        onSuccess: () => {
          showToast('success', 'Payment method added');
          navigation.goBack();
        },
        onError: (error: Error) => showToast('error', 'Failed to add method', error.message),
      },
    );
  };

  const digitsOrFallback = () => cardNumber.replace(/\s/g, '').slice(-4);
  const maskWallet = () => walletNumber.replace(/\D/g, '').slice(-4);
  const labelOf = (t: string) => methodOptions.find((o) => o.id === t)?.label ?? '';

  return (
    <Screen>
      <ScreenHeader title="Add payment method" />
      <View className="flex-1 px-4 pb-6">
        <Text className="mt-4 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Method type</Text>
        <View className="flex-row flex-wrap gap-2.5">
          {methodOptions.map((option) => (
            <PressableCard key={option.id} selected={type === option.id} onPress={() => setType(option.id)} icon={option.icon} label={option.label} />
          ))}
        </View>

        {type === 'card' ? (
          <View className="mt-6 gap-4">
            <View>
              <Text className="mb-2 text-[13px] font-semibold text-ink">Card brand</Text>
              <View className="flex-row gap-2.5">
                {cardBrands.map((b) => (
                  <PressableChip key={b.id} selected={brand === b.id} onPress={() => setBrand(b.id)} label={b.label} />
                ))}
              </View>
            </View>
            <Input
              label="Card number"
              placeholder="4111 1111 1111 1111"
              keyboardType="number-pad"
              maxLength={19}
              value={cardNumber}
              onChangeText={(text) =>
                setCardNumber(
                  text
                    .replace(/[^\d]/g, '')
                    .replace(/(\d{4})(?=\d)/g, '$1 ')
                    .slice(0, 19),
                )
              }
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={expiry}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^\d]/g, '');
                    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}` : digits);
                  }}
                />
              </View>
              <View className="flex-1">
                <Input label="Name on card" placeholder="JUAN DELA CRUZ" autoCapitalize="characters" value={name} onChangeText={setName} />
              </View>
            </View>
          </View>
        ) : (
          <View className="mt-6">
            <Input
              label="Mobile number"
              placeholder="0917 123 4567"
              keyboardType="phone-pad"
              value={walletNumber}
              onChangeText={setWalletNumber}
            />
          </View>
        )}

        <View className="flex-1" />
        <Button label="Save method" size="lg" fullWidth loading={addMethod.isPending} onPress={handleSave} />
      </View>
    </Screen>
  );
}

function PressableCard({ selected, onPress, icon, label }: { selected: boolean; onPress: () => void; icon: string; label: string }) {
  return (
    <View
      className={cn(
        'min-w-[45%] flex-1 flex-row items-center gap-2.5 rounded-2xl border bg-white p-4',
        selected ? 'border-primary bg-orange-50' : 'border-line',
      )}
    >
      <Pressable onPress={onPress} className="flex-row items-center gap-2.5" style={{ flex: 1 }}>
        <Feather name={icon as never} size={18} color={selected ? '#F97316' : '#64748B'} />
        <Text className={cn('text-[13px] font-semibold', selected ? 'text-primary-dark' : 'text-ink')}>{label}</Text>
      </Pressable>
      <View className={cn('h-4 w-4 rounded-full border-2', selected ? 'border-primary bg-primary' : 'border-slate-300')}>
        {selected ? <View className="m-0.5 h-2.5 w-2.5 rounded-full bg-white" /> : null}
      </View>
    </View>
  );
}

function PressableChip({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-full border px-4 py-2',
        selected ? 'border-primary bg-orange-50' : 'border-line bg-white',
      )}
    >
      <Text className={cn('text-[12px] font-semibold', selected ? 'text-primary-dark' : 'text-ink-secondary')}>{label}</Text>
    </Pressable>
  );
}
