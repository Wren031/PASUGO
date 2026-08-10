import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { SectionCard } from '@/components/cards/SectionCard';
import { PaymentMethodCard } from '@/components/cards/PaymentMethodCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { BottomSheet } from '@/components/modals/BottomSheet';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/ui/Badge';
import {
  usePaymentMethods,
  useSetDefaultPayment,
  useTransactions,
  useTopUp,
  useTopUpOptions,
  useWallet,
} from '../hooks/usePayments';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { PaymentTransaction } from '@/types/payment';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

const txTone = {
  Success: 'success',
  Pending: 'warning',
  Failed: 'danger',
  Refunded: 'info',
} as const;

export function PaymentsScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const userId = user?.id ?? '';
  const { data: methods, isLoading: methodsLoading } = usePaymentMethods(userId);
  const { data: wallet } = useWallet(userId);
  const { data: transactions, isLoading: txLoading } = useTransactions(userId);
  const { data: topUpOptions } = useTopUpOptions();
  const setDefault = useSetDefaultPayment(userId);
  const topUp = useTopUp(userId);

  const [topUpOpen, setTopUpOpen] = useState(false);

  const handleTopUp = (amount: number) => {
    topUp.mutate(amount, {
      onSuccess: () => {
        setTopUpOpen(false);
        showToast('success', 'Wallet topped up', `${formatCurrency(amount)} added to your wallet.`);
      },
      onError: (error: Error) => showToast('error', 'Top-up failed', error.message),
    });
  };

  return (
    <Screen>
      <ScreenHeader title="Payments" />
      <View className="flex-1 px-4 pb-6">
        <View className="mt-4 rounded-2xl bg-primary p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] font-semibold text-orange-100">HatodGo Wallet</Text>
              <Text className="mt-1 text-[26px] font-extrabold text-white">
                {wallet ? formatCurrency(wallet.balance) : '—'}
              </Text>
            </View>
            <Pressable
              onPress={() => setTopUpOpen(true)}
              className="flex-row items-center gap-1.5 rounded-full bg-white px-4 py-2.5"
            >
              <Feather name="plus" size={16} color="#F97316" />
              <Text className="text-[13px] font-bold text-primary-dark">Top up</Text>
            </Pressable>
          </View>
        </View>

        <Text className="mt-5 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Payment methods
        </Text>
        {methodsLoading ? (
          <SkeletonList count={2} />
        ) : methods && methods.length > 0 ? (
          <View className="gap-2.5">
            {methods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                selected={method.isDefault}
                onPress={() => {
                  if (!method.isDefault) {
                    setDefault.mutate(method.id, {
                      onSuccess: () => showToast('success', 'Default payment updated'),
                    });
                  }
                }}
              />
            ))}
          </View>
        ) : (
          <EmptyState title="No payment methods" message="Add a payment method to pay faster." />
        )}

        <Button
          label="Add payment method"
          variant="outline"
          fullWidth
          className="mt-3"
          onPress={() => navigation.navigate('AddPaymentMethod')}
          leftIcon={<Feather name="plus" size={16} color="#0F172A" />}
        />

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Transactions
        </Text>
        {txLoading ? (
          <SkeletonList count={2} />
        ) : transactions && transactions.length > 0 ? (
          <SectionCard>
            {transactions.map((tx: PaymentTransaction, index: number) => (
              <View
                key={tx.id}
                className={cn('flex-row items-center gap-3 px-4 py-3.5', index > 0 && 'border-t border-line')}
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                  <MaterialCommunityIcons
                    name={tx.type === 'top-up' ? 'arrow-up-circle' : tx.type === 'refund' ? 'arrow-u-left-top' : 'motorbike'}
                    size={17}
                    color="#F97316"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-ink">{tx.description}</Text>
                  <Text className="mt-0.5 text-[11px] text-ink-muted">
                    {tx.reference} · {formatDateTime(tx.date)}
                  </Text>
                </View>
                <View className="items-end gap-1">
                  <Text
                    className={cn(
                      'text-[13px] font-extrabold',
                      tx.type === 'top-up' || tx.type === 'refund' ? 'text-success' : 'text-ink',
                    )}
                  >
                    {tx.type === 'top-up' || tx.type === 'refund' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </Text>
                  <Badge label={tx.status} tone={txTone[tx.status]} />
                </View>
              </View>
            ))}
          </SectionCard>
        ) : (
          <EmptyState title="No transactions yet" message="Payments you make will appear here." />
        )}
      </View>

      <BottomSheet visible={topUpOpen} onClose={() => setTopUpOpen(false)}>
        <Text className="text-center text-[17px] font-bold text-ink">Top up wallet</Text>
        <Text className="mt-1 text-center text-[12px] text-ink-muted">
          Current balance: {wallet ? formatCurrency(wallet.balance) : '—'}
        </Text>
        <View className="mt-5 flex-row flex-wrap gap-3">
          {(topUpOptions ?? []).map((option) => (
            <Pressable
              key={option.amount}
              onPress={() => handleTopUp(option.amount)}
              className="flex-1 min-w-[45%] rounded-2xl border border-line bg-white p-4 active:bg-slate-50"
            >
              <Text className="text-[16px] font-extrabold text-ink">{formatCurrency(option.amount)}</Text>
              {option.bonus > 0 ? (
                <Text className="mt-0.5 text-[11px] font-bold text-success">+{formatCurrency(option.bonus)} bonus</Text>
              ) : (
                <Text className="mt-0.5 text-[11px] text-ink-muted">No bonus</Text>
              )}
            </Pressable>
          ))}
        </View>
        <Button label="Cancel" variant="ghost" fullWidth className="mt-4" onPress={() => setTopUpOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}
