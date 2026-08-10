import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { StatCard } from '@/components/cards/StatCard';
import { SectionCard } from '@/components/cards/SectionCard';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverEarnings } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { ChartPoint } from '@/types/driver';

type Period = 'today' | 'week' | 'month';

export function DriverEarningsScreen() {
  const user = useAuthStore(selectUser);
  const { data: report, isLoading } = useDriverEarnings(user?.id ?? '');
  const [period, setPeriod] = useState<Period>('today');

  const summary = report?.[period];

  return (
    <Screen>
      <ScreenHeader title="Earnings" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row gap-2.5">
          {(['today', 'week', 'month'] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setPeriod(option)}
              className={cn(
                'flex-1 min-h-[48px] items-center justify-center rounded-2xl border py-2',
                period === option ? 'border-primary bg-orange-50' : 'border-line bg-white',
              )}
            >
              <Text className={cn('text-[13px] font-bold', period === option ? 'text-primary-dark' : 'text-ink-secondary')}>
                {option === 'today' ? 'Today' : option === 'week' ? 'This week' : 'This month'}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading || !summary ? (
          <View className="mt-4">
            <SkeletonList count={2} />
          </View>
        ) : (
          <>
            <View className="mt-4 flex-row flex-wrap gap-3">
              <StatCard
                label="Net earnings"
                value={formatCurrency(summary.netEarnings)}
                icon={<View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                accent
                className="flex-1 min-w-[45%]"
              />
              <StatCard
                label="Gross"
                value={formatCurrency(summary.grossEarnings)}
                icon={<View className="h-2.5 w-2.5 rounded-full bg-slate-400" />}
                className="flex-1 min-w-[45%]"
              />
              <StatCard
                label="Trips"
                value={String(summary.trips)}
                icon={<View className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                className="flex-1 min-w-[45%]"
              />
              <StatCard
                label="Distance"
                value={`${summary.distanceKm} km`}
                icon={<View className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                className="flex-1 min-w-[45%]"
              />
            </View>

            <View className="mt-4 rounded-2xl border border-line bg-white p-4">
              <Text className="text-[13px] font-semibold text-ink-secondary">Commission deducted</Text>
              <Text className="mt-0.5 text-[18px] font-extrabold text-danger">
                -{formatCurrency(summary.commission)}
              </Text>
              <View className="mt-3 gap-1.5">
                <ProgressRow label="Gross earnings" value={summary.grossEarnings} total={summary.grossEarnings} color="#F97316" />
                <ProgressRow label="Commission" value={summary.commission} total={summary.grossEarnings} color="#EF4444" />
                <ProgressRow label="Net earnings" value={summary.netEarnings} total={summary.grossEarnings} color="#22C55E" />
              </View>
            </View>

            <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Weekly breakdown
            </Text>
            <BarChart data={report.weeklyChart} />

            <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Monthly breakdown
            </Text>
            <BarChart data={report.monthlyChart} />

            <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Recent trips
            </Text>
            <SectionCard>
              {report.recentTrips.map((trip, index) => (
                <View
                  key={trip.id}
                  className={`flex-row items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-line' : ''}`}
                >
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold text-ink">{trip.passengerName}</Text>
                    <Text className="mt-0.5 text-[11px] text-ink-muted">
                      {trip.distanceKm} km · {trip.paymentMethod}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[13px] font-extrabold text-success">+{formatCurrency(trip.net)}</Text>
                    <Text className="text-[10px] text-ink-muted">net of commission</Text>
                  </View>
                </View>
              ))}
            </SectionCard>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function ProgressRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percent = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[12px] text-ink-secondary">{label}</Text>
        <Text className="text-[12px] font-bold text-ink">{formatCurrency(value)}</Text>
      </View>
      <View className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <View className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}

function BarChart({ data }: { data: ChartPoint[] }) {
  const W = 340;
  const H = 160;
  const padBottom = 20;
  const padTop = 12;
  const chartH = H - padBottom - padTop;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = W / data.length;
  const barWidth = Math.min(22, slot * 0.55);

  return (
    <View className="rounded-2xl border border-line bg-white p-3">
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <Line
            key={fraction}
            x1={0}
            x2={W}
            y1={padTop + chartH * (1 - fraction)}
            y2={padTop + chartH * (1 - fraction)}
            stroke="#F1F5F9"
            strokeWidth={1}
          />
        ))}
        {data.map((point, index) => {
          const barH = Math.max(2, (point.value / max) * chartH);
          const x = index * slot + (slot - barWidth) / 2;
          const y = padTop + chartH - barH;
          const labelEvery = data.length > 8 ? 2 : 1;
          return (
            <View key={point.label} pointerEvents="none">
              <Rect x={x} y={y} width={barWidth} height={barH} rx={4} fill={point.value === 0 ? '#E2E8F0' : '#F97316'} />
              {index % labelEvery === 0 ? (
                <SvgText x={index * slot + slot / 2} y={H - 6} fontSize={9} fill="#94A3B8" textAnchor="middle">
                  {point.label}
                </SvgText>
              ) : null}
            </View>
          );
        })}
      </Svg>
    </View>
  );
}
