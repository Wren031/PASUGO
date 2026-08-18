import { Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/ui/Badge';
import { useCompleteRegistration } from '../hooks/useCompleteRegistration';
import { useRegistrationStore } from '@/store/registration-store';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'DriverReview'>;

const reviewSteps = [
  { label: 'Application submitted', status: 'done' },
  { label: 'Under admin review', status: 'current' },
  { label: 'Account approved', status: 'pending' },
] as const;

export function DriverReviewScreen() {
  const navigation = useNavigation<Navigation>();
  const draft = useRegistrationStore((state) => state.draft);
  const completeRegistration = useCompleteRegistration();

  const handleFinish = () => {
    completeRegistration.mutate(draft, {
      onError: (error: Error) => {
        showToast('error', 'Registration failed', error.message);
      },
    });
  };

  return (
    <AuthLayout title="Application submitted" subtitle="Your documents are now being reviewed by our team." onBack={() => navigation.goBack()}>
      <View className="gap-5">
        <View className="items-center py-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
            <MaterialCommunityIcons name="clipboard-check-outline" size={40} color="#F97316" />
          </View>
          <View className="mt-4 flex-row items-center gap-2">
            <Badge label="Pending admin review" tone="warning" />
          </View>
        </View>

        <View className="rounded-2xl border border-line bg-white p-5">
          {reviewSteps.map((step, index) => {
            const isLast = index === reviewSteps.length - 1;
            return (
              <View key={step.label} className="flex-row gap-3">
                <View className="items-center">
                  <View
                    className={cn(
                      'h-7 w-7 items-center justify-center rounded-full',
                      step.status === 'done' && 'bg-green-100',
                      step.status === 'current' && 'bg-primary-soft',
                      step.status === 'pending' && 'bg-slate-100',
                    )}
                  >
                    {step.status === 'done' ? (
                      <Feather name="check" size={14} color="#16A34A" />
                    ) : step.status === 'current' ? (
                      <Feather name="clock" size={14} color="#F97316" />
                    ) : (
                      <View className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </View>
                  {!isLast ? <View className="w-px flex-1 bg-line" /> : null}
                </View>
                <View className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                  <Text
                    className={cn(
                      'text-[14px] font-semibold',
                      step.status === 'pending' ? 'text-ink-muted' : 'text-ink',
                    )}
                  >
                    {step.label}
                  </Text>
                  {step.status === 'current' ? (
                    <Text className="mt-0.5 text-[12px] leading-4 text-ink-muted">
                      Usually takes 1–2 business days. You can check the status anytime.
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View className="rounded-2xl border border-line bg-white p-4">
          <Text className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">Submitted info</Text>
          <View className="mt-2 gap-1.5">
            <Row label="Name" value={draft.profile?.name ?? '—'} />
            <Row label="Email" value={draft.email} />
            <Row label="Documents" value={`${draft.documents.length} uploaded`} />
          </View>
        </View>

        <Button
          label="Go to Dashboard"
          size="lg"
          fullWidth
          loading={completeRegistration.isPending}
          onPress={handleFinish}
          leftIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
        />
      </View>
    </AuthLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[12.5px] text-ink-muted">{label}</Text>
      <Text className="text-[12.5px] font-semibold text-ink">{value}</Text>
    </View>
  );
}