import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { WalletCard } from '@/components/cards/WalletCard';
import { SectionCard } from '@/components/cards/SectionCard';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/modals/BottomSheet';
import { Button } from '@/components/buttons/Button';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWallet, useWithdraw, useTransactions } from '../hooks/useDriverWallet';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { PaymentTransaction } from '@/types/payment';
import React from 'react';

const WITHDRAW_AMOUNTS = [500, 1000, 2000];

const txTone = {
  Success: 'success',
  Pending: 'warning',
  Failed: 'danger',
  Refunded: 'info',
} as const;

export function DriverWalletScreen() {
  const user = useAuthStore(selectUser);
  const userId = user?.id ?? '';
  const { data: wallet } = useWallet(userId);
  const { data: transactions, isLoading } = useTransactions(userId);
  const withdraw = useWithdraw(userId);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);

  const balance = wallet?.balance ?? 0;

  const handleWithdraw = () => {
    if (!amount) return;
    withdraw.mutate(amount, {
      onSuccess: () => {
        setSheetOpen(false);
        setAmount(null);
        showToast('success', 'Payout requested', `${formatCurrency(amount)} will be sent to your bank within 1-2 business days.`);
      },
      onError: (error: Error) => showToast('error', 'Payout failed', error.message),
    });
  };

  return (
    <Screen>
      <ScreenHeader title="Wallet" subtitle="Earnings and payouts" />
      <ScrollView className="flex-1 px-4 pb-8">
        <View className="mt-4">
          <WalletCard
            balance={balance}
            subtitle="Available balance"
            suffix={`HAT • ${userId.slice(-4).toUpperCase()}`}
            actionLabel="Withdraw"
            actionIcon="arrow-down-left"
            onAction={() => setSheetOpen(true)}
          />
        </View>

        <View className="mt-4 flex-row items-start gap-2.5 rounded-2xl bg-info-soft p-3.5">
          <Feather name="info" size={15} color="#1D4ED8" />
          <Text className="flex-1 text-[12px] leading-5 text-blue-700">
            Payouts are transferred to your linked bank account within 1-2 business days. A ₱ 15.00 service fee applies per withdrawal.
          </Text>
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
          Transactions
        </Text>
        {isLoading ? (
          <SkeletonList count={3} />
        ) : transactions && transactions.length > 0 ? (
          <SectionCard>
            {transactions.map((tx: PaymentTransaction, index: number) => {
              const incoming = tx.type === 'payout' || tx.type === 'top-up' || tx.type === 'refund';
              return (
                <View
                  key={tx.id}
                  className={cn('flex-row items-center gap-3 px-4 py-3.5', index > 0 && 'border-t border-line')}
                >
                  <View
                    className={cn(
                      'h-9 w-9 items-center justify-center rounded-full',
                      incoming ? 'bg-success-soft' : 'bg-surface-muted',
                    )}
                  >
                    <MaterialCommunityIcons
                      name={tx.type === 'payout' ? 'bank-transfer' : tx.type === 'top-up' ? 'arrow-up-circle' : 'motorbike'}
                      size={17}
                      color={incoming ? '#16A34A' : '#64748B'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold text-ink">{tx.description}</Text>
                    <Text className="mt-0.5 text-[11px] text-ink-muted">
                      {tx.reference} · {formatDateTime(tx.date)}
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text className={cn('text-[13px] font-extrabold', incoming ? 'text-success' : 'text-ink')}>
                      {incoming ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </Text>
                    <Badge label={tx.status} tone={txTone[tx.status]} />
                  </View>
                </View>
              );
            })}
          </SectionCard>
        ) : (
          <EmptyState title="No transactions yet" message="Earnings from completed trips will appear here." />
        )}
      </ScrollView>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-center text-[17px] font-bold text-ink">Withdraw to bank</Text>
        <Text className="mt-1 text-center text-[12px] text-ink-muted">
          Available balance: {formatCurrency(balance)}
        </Text>

        <View className="mt-5 flex-row flex-wrap gap-3">
          {WITHDRAW_AMOUNTS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setAmount(option)}
              className={cn(
                'flex-1 min-w-[45%] rounded-2xl border p-4 active:bg-slate-50',
                amount === option ? 'border-primary bg-primary-soft' : 'border-line bg-white',
              )}
            >
              <Text className={cn('text-[16px] font-extrabold', amount === option ? 'text-primary-dark' : 'text-ink')}>
                {formatCurrency(option)}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setAmount(balance)}
            className={cn(
              'flex-1 min-w-[45%] rounded-2xl border p-4 active:bg-slate-50',
              amount === balance && amount !== null ? 'border-primary bg-primary-soft' : 'border-line bg-white',
            )}
          >
            <Text className={cn('text-[16px] font-extrabold', amount === balance ? 'text-primary-dark' : 'text-ink')}>
              {formatCurrency(balance)}
            </Text>
            <Text className="mt-0.5 text-[11px] text-ink-muted">Withdraw all</Text>
          </Pressable>
        </View>

        <Button
          label={withdraw.isPending ? 'Processing…' : 'Confirm withdrawal'}
          size="lg"
          fullWidth
          disabled={!amount || withdraw.isPending}
          className="mt-5"
          onPress={handleWithdraw}
        />
        <Button label="Cancel" variant="ghost" fullWidth className="mt-2" onPress={() => setSheetOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}