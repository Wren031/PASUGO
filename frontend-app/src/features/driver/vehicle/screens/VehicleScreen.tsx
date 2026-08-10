import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { VehicleCard } from '@/components/cards/VehicleCard';
import { SectionCard } from '@/components/cards/SectionCard';
import { Badge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/loaders/Skeleton';
import { useDriverDocuments, useDriverVehicle } from '@/features/driver/profile/hooks/useDriverExtras';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const docTone = {
  Approved: 'success',
  Pending: 'warning',
  Expired: 'danger',
  Rejected: 'danger',
} as const;

export function VehicleScreen() {
  const user = useAuthStore(selectUser);
  const driverId = user?.id ?? '';
  const { data: vehicle, isLoading: vehicleLoading } = useDriverVehicle(driverId);
  const { data: documents, isLoading: docsLoading } = useDriverDocuments(driverId);

  return (
    <Screen>
      <ScreenHeader title="Vehicle & documents" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        {vehicleLoading || !vehicle ? (
          <View className="mt-4">
            <SkeletonList count={1} />
          </View>
        ) : (
          <View className="mt-4">
            <VehicleCard vehicle={vehicle} />
          </View>
        )}

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Documents</Text>
        {docsLoading || !documents ? (
          <SkeletonList count={3} />
        ) : (
          <SectionCard>
            {documents.map((doc, index) => {
              const tone = docTone[doc.info.status as keyof typeof docTone] ?? 'neutral';
              return (
                <View
                  key={doc.label}
                  className={cn('flex-row items-center gap-3 px-4 py-4', index > 0 && 'border-t border-line')}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Feather
                      name={doc.info.status === 'Approved' ? 'check-circle' : doc.info.status === 'Pending' ? 'clock' : 'x-circle'}
                      size={18}
                      color={doc.info.status === 'Approved' ? '#16A34A' : doc.info.status === 'Pending' ? '#D97706' : '#EF4444'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-bold text-ink">{doc.label}</Text>
                    <Text className="mt-0.5 text-[11px] text-ink-muted">{doc.description}</Text>
                    {doc.info.note ? (
                      <Text className="mt-0.5 text-[10px] text-ink-muted">{doc.info.note}</Text>
                    ) : null}
                  </View>
                  <Badge label={doc.info.status} tone={tone} />
                </View>
              );
            })}
          </SectionCard>
        )}

        {vehicle ? (
          <View className="mt-6 rounded-2xl border border-line bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[14px] font-bold text-ink">Registration & insurance</Text>
              <Badge label={vehicle.status} tone={vehicle.status === 'Active' ? 'success' : vehicle.status === 'Expiring Soon' ? 'warning' : 'danger'} />
            </View>
            <View className="mt-3 flex-row gap-3">
              <MiniStat label="Registration" value={formatDate(vehicle.registrationExpiry)} />
              <MiniStat label="Insurance" value={formatDate(vehicle.insuranceExpiry)} />
              <MiniStat label="Trips done" value={String(vehicle.tripsCount)} />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-surface-muted px-3 py-3">
      <Text className="text-[10px] text-ink-muted">{label}</Text>
      <Text className="mt-0.5 text-[12px] font-bold text-ink">{value}</Text>
    </View>
  );
}
