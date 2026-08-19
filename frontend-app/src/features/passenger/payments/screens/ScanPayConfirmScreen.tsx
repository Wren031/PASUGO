import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth-store';
import { useScanQr, usePayMerchant } from '../hooks/useScanPay';
import { useWallet } from '@/features/driver/wallet/hooks/useDriverWallet';
import { showToast } from '@/store/toast-store';
import { formatCurrency as formatPeso } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { PassengerStackParamList } from '@/navigation/types';
import type { PaymentTransaction, WalletAccount } from '@/types/payment';

type Route = RouteProp<PassengerStackParamList, 'ScanPayConfirm'>;
type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const PRESETS = [50, 100, 200, 500];

export function ScanPayConfirmScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((state) => state.session?.user);

  const { data: merchant, isLoading, error } = useScanQr(route.params.payload);
  const { data: wallet } = useWallet(user?.id ?? '');
  const payMerchant = usePayMerchant(user?.id ?? '');

  const [amount, setAmount] = useState(0);
  const [custom, setCustom] = useState('');
  const [receipt, setReceipt] = useState<{ transaction: PaymentTransaction; wallet: WalletAccount } | null>(null);

  const balance = wallet?.balance ?? 0;
  const canPay = amount > 0 && amount <= balance && !payMerchant.isPending;

  if (isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Scan result" />
        <View className="flex-1 items-center justify-center px-8">
          <View className="h-16 w-16 animate-pulse rounded-3xl bg-surface-muted" />
          <Text className="mt-4 text-[13px] text-ink-muted">Verifying QR code…</Text>
        </View>
      </Screen>
    );
  }

  if (error || !merchant) {
    return (
      <Screen>
        <ScreenHeader title="Scan result" />
        <View className="flex-1 items-center justify-center px-8">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-red-100">
            <Feather name="x-circle" size={30} color="#EF4444" />
          </View>
          <Text className="mt-4 text-center text-[15px] font-bold text-ink">QR code not recognized</Text>
          <Text className="mt-1.5 text-center text-[12.5px] leading-5 text-ink-muted">
            {error instanceof Error ? error.message : 'This code is not a HatodGo partner QR.'}
          </Text>
          <Button label="Back to scanner" size="lg" className="mt-6" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    );
  }

  const handlePay = () => {
    payMerchant.mutate(
      { merchantId: merchant.id, amount },
      {
        onSuccess: (result) => {
          setReceipt(result);
        },
        onError: (err: Error) => {
          showToast('error', 'Payment failed', err.message);
        },
      },
    );
  };

  if (receipt) {
    return (
      <Screen>
        <ScreenHeader title="Payment receipt" />
        <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
          <View className="mt-4 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Feather name="check" size={40} color="#16A34A" />
            </View>
            <Text className="mt-3 text-[20px] font-extrabold text-ink">Payment successful</Text>
            <Text className="mt-1 text-[12px] text-ink-muted">
              {receipt.transaction.reference}
            </Text>
          </View>

          <Card className="mt-5 p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[22px]">
                <Text className="text-[22px]">{merchant.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">{merchant.name}</Text>
                <Text className="text-[11.5px] text-ink-muted">{merchant.location}</Text>
              </View>
              <Text className="text-[18px] font-extrabold text-ink">
                {formatPeso(receipt.transaction.amount)}
              </Text>
            </View>
            <View className="my-4 h-px bg-line" />
            <View className="flex-row justify-between py-1">
              <Text className="text-[12.5px] text-ink-muted">Payment method</Text>
              <Text className="text-[12.5px] font-semibold text-ink">HatodGo Wallet</Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-[12.5px] text-ink-muted">Status</Text>
              <Badge label="Success" tone="success" />
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-[12.5px] text-ink-muted">New wallet balance</Text>
              <Text className="text-[12.5px] font-semibold text-ink">
                {formatPeso(receipt.wallet.balance)}
              </Text>
            </View>
          </Card>

          <Button label="Done" size="lg" fullWidth className="mt-5" onPress={() => navigation.popToTop()} />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Confirm payment" subtitle={merchant.name} />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Card className="mt-2 p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <Text className="text-[26px]">{merchant.emoji}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-bold text-ink">{merchant.name}</Text>
              <Text className="text-[12px] text-ink-muted">
                {merchant.category} · {merchant.location}
              </Text>
            </View>
            <Badge label="HatodGo Verified" tone="success" icon={<Feather name="shield" size={11} color="#16A34A" />} />
          </View>
        </Card>

        <Card className="mt-3 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold text-ink">Amount to pay</Text>
            <View className="flex-row items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1">
              <MaterialCommunityIcons name="wallet" size={12} color="#1D4ED8" />
              <Text className="text-[12px] font-semibold text-blue-700">{formatPeso(balance)}</Text>
            </View>
          </View>

          <Text
            className={cn(
              'mt-3 text-[34px] font-extrabold tracking-tight text-ink',
              amount > 0 && amount <= balance ? 'text-primary' : '',
            )}
          >
            ₱{amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </Text>

          <View className="mt-4 flex-row gap-2">
            {PRESETS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => {
                  setAmount(preset);
                  setCustom('');
                }}
                className={cn(
                  'flex-1 items-center rounded-xl border py-2.5 active:opacity-70',
                  amount === preset && !custom
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-line bg-white',
                )}
              >
                <Text
                  className={cn(
                    'text-[13px] font-bold',
                    amount === preset && !custom ? 'text-orange-600' : 'text-ink-secondary',
                  )}
                >
                  ₱{preset}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-3 flex-row items-center gap-2 rounded-xl border border-line bg-surface-muted px-3">
            <Feather name="edit-3" size={14} color="#94A3B8" />
            <TextInput
              value={custom}
              onChangeText={(value) => {
                setCustom(value);
                const parsed = Number(value);
                setAmount(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
              }}
              placeholder="Or enter a custom amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              className="h-12 flex-1 text-[13px] text-ink"
            />
          </View>

          {amount > balance ? (
            <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5">
              <Feather name="alert-circle" size={13} color="#EF4444" />
              <Text className="text-[11.5px] font-semibold text-red-600">
                Insufficient balance. Top up your wallet first.
              </Text>
            </View>
          ) : null}
        </Card>

        <Card className="mt-3 flex-row items-center gap-2.5 p-3.5">
          <Feather name="info" size={14} color="#1D4ED8" />
          <Text className="flex-1 text-[11.5px] leading-5 text-blue-700">
            Paid instantly from your HatodGo Wallet. A receipt will be sent to your transaction history.
          </Text>
        </Card>

        <Button
          label={payMerchant.isPending ? 'Processing payment…' : 'Pay now'}
          size="lg"
          fullWidth
          className="mt-5"
          loading={payMerchant.isPending}
          disabled={!canPay}
          onPress={handlePay}
          leftIcon={<Feather name="credit-card" size={16} color="#FFFFFF" />}
        />
      </ScrollView>
    </Screen>
  );
}
