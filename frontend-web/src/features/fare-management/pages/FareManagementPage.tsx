import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClock, FiMapPin, FiPercent } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import InfoRow from '@/components/common/InfoRow';
import { useFareEstimate, useFareSettings, useUpdateFareSettings } from '../hooks/useFareManagement';
import { formatCurrency } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { FareSettings } from '../types';

export default function FareManagementPage() {
  const { data: settings, isLoading } = useFareSettings();
  const updateMutation = useUpdateFareSettings();
  const [estimateConfig, setEstimateConfig] = useState({ distanceKm: 5, durationMin: 15, night: false, holiday: false, surge: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FareSettings>();

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const estimate = useFareEstimate(estimateConfig);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success('Fare settings saved', 'The new fare structure is now active.');
    } catch {
      toast.error('Save failed', 'Unable to update fare settings.');
    }
  });

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Fare Management"
        description="Configure base fares, per-kilometer rates, and dynamic pricing."
        actions={
          <Button onClick={onSubmit} loading={updateMutation.isPending}>
            Save Changes
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Base Fare Structure" subtitle="Applies to all ride types">
            <form id="fare-form" onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Base Fare (₱)"
                type="number"
                step="0.5"
                error={errors.baseFare?.message}
                {...register('baseFare', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
              />
              <Input
                label="Price Per Kilometer (₱)"
                type="number"
                step="0.5"
                error={errors.pricePerKm?.message}
                {...register('pricePerKm', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
              />
              <Input
                label="Price Per Minute (₱)"
                type="number"
                step="0.5"
                error={errors.pricePerMinute?.message}
                {...register('pricePerMinute', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
              />
              <Input
                label="Booking Fee (₱)"
                type="number"
                step="0.5"
                error={errors.bookingFee?.message}
                {...register('bookingFee', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
              />
              <Input
                label="Minimum Fare (₱)"
                type="number"
                step="0.5"
                error={errors.minimumFare?.message}
                {...register('minimumFare', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
              />
            </form>
          </Card>

          <Card title="Dynamic Pricing" subtitle="Surge, holiday, and night rates">
            <form id="fare-form-2" onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Surge Multiplier (×)"
                type="number"
                step="0.05"
                error={errors.surgeMultiplier?.message}
                {...register('surgeMultiplier', { required: 'Required', min: { value: 1, message: 'Must be at least 1' } })}
              />
              <Input
                label="Surge Hours"
                error={errors.surgeHours?.message}
                {...register('surgeHours', { required: 'Required' })}
              />
              <Input
                label="Holiday Rate (×)"
                type="number"
                step="0.05"
                error={errors.holidayRate?.message}
                {...register('holidayRate', { required: 'Required', min: { value: 1, message: 'Must be at least 1' } })}
              />
              <Input
                label="Night Rate (×)"
                type="number"
                step="0.05"
                error={errors.nightRate?.message}
                {...register('nightRate', { required: 'Required', min: { value: 1, message: 'Must be at least 1' } })}
              />
              <Input
                label="Night Rate Hours"
                error={errors.nightHours?.message}
                {...register('nightHours', { required: 'Required' })}
              />
              <div className="flex items-end pb-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                  <FiPercent size={14} className="text-primary-500" />
                  Changes apply immediately to new bookings
                </div>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Fare Calculator" subtitle="Preview the fare for a sample ride">
            <div className="space-y-4">
              <Input
                label="Distance (km)"
                type="number"
                value={estimateConfig.distanceKm}
                onChange={(event) => setEstimateConfig((config) => ({ ...config, distanceKm: Number(event.target.value) }))}
                min={0}
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={estimateConfig.durationMin}
                onChange={(event) => setEstimateConfig((config) => ({ ...config, durationMin: Number(event.target.value) }))}
                min={0}
              />
              <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                <Toggle
                  label="Night rate"
                  description={settings.nightHours}
                  checked={estimateConfig.night}
                  onChange={(checked) => setEstimateConfig((config) => ({ ...config, night: checked }))}
                />
                <Toggle
                  label="Holiday rate"
                  description={`${settings.holidayRate}x multiplier`}
                  checked={estimateConfig.holiday}
                  onChange={(checked) => setEstimateConfig((config) => ({ ...config, holiday: checked }))}
                />
                <Toggle
                  label="Surge pricing"
                  description={`${settings.surgeMultiplier}x · ${settings.surgeHours}`}
                  checked={estimateConfig.surge}
                  onChange={(checked) => setEstimateConfig((config) => ({ ...config, surge: checked }))}
                />
              </div>
            </div>

            {estimate.data && (
              <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50/60 p-4">
                <InfoRow label="Base fare" value={formatCurrency(estimate.data.baseFare)} />
                <InfoRow label="Distance charge" value={formatCurrency(estimate.data.distanceCharge)} />
                <InfoRow label="Time charge" value={formatCurrency(estimate.data.timeCharge)} />
                <InfoRow label="Booking fee" value={formatCurrency(estimate.data.bookingFee)} />
                {estimate.data.adjustments.map((adjustment) => (
                  <InfoRow key={adjustment.label} label={adjustment.label} value={formatCurrency(adjustment.amount)} />
                ))}
                <div className="my-2 border-t border-slate-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Estimated total</span>
                  <span className="text-xl font-extrabold text-primary-600">{formatCurrency(estimate.data.total)}</span>
                </div>
              </div>
            )}
          </Card>

          <Card title="Pricing Notes" subtitle="How fares are communicated">
            <ul className="space-y-3 text-xs leading-relaxed text-slate-600">
              <li className="flex items-start gap-2.5">
                <FiMapPin size={14} className="mt-0.5 shrink-0 text-primary-500" />
                The app always shows the estimated fare before the passenger confirms a booking.
              </li>
              <li className="flex items-start gap-2.5">
                <FiClock size={14} className="mt-0.5 shrink-0 text-primary-500" />
                Time-based charges only apply while the trip is active, not while waiting.
              </li>
              <li className="flex items-start gap-2.5">
                <FiPercent size={14} className="mt-0.5 shrink-0 text-primary-500" />
                Promo code discounts are applied after surge and holiday multipliers.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
