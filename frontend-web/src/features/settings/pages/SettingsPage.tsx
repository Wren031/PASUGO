import { useEffect, useState } from 'react';
import { FiBell, FiCreditCard, FiLock, FiSettings, FiShield, FiTruck } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Tabs from '@/components/ui/Tabs';
import { useSettings, useUpdateGeneral, useUpdateNotifications, useUpdateOperating, useUpdatePayment, useUpdateSecurity } from '../hooks/useSettings';
import type { GeneralSettings, NotificationSettings, OperatingSettings, PaymentSettings, SecuritySettings } from '../types';
import { toast } from '@/app/store/toast-store';

type SettingsSection = 'general' | 'operating' | 'payment' | 'notifications' | 'security';

const sections: Array<{ label: string; value: SettingsSection; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
  { label: 'General', value: 'general', icon: FiSettings },
  { label: 'Operating', value: 'operating', icon: FiTruck },
  { label: 'Payments', value: 'payment', icon: FiCreditCard },
  { label: 'Notifications', value: 'notifications', icon: FiBell },
  { label: 'Security', value: 'security', icon: FiLock },
];

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const [section, setSection] = useState<SettingsSection>('general');

  const [general, setGeneral] = useState<GeneralSettings | null>(null);
  const [operating, setOperating] = useState<OperatingSettings | null>(null);
  const [payment, setPayment] = useState<PaymentSettings | null>(null);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);

  const updateGeneral = useUpdateGeneral();
  const updateOperating = useUpdateOperating();
  const updatePayment = useUpdatePayment();
  const updateSecurity = useUpdateSecurity();
  const updateNotifications = useUpdateNotifications();

  useEffect(() => {
    if (data) {
      setGeneral(data.general);
      setOperating(data.operating);
      setPayment(data.payment);
      setSecurity(data.security);
      setNotifications(data.notifications);
    }
  }, [data]);

  if (isLoading || !general || !operating || !payment || !security || !notifications) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  const saveSection = async () => {
    try {
      const map = {
        general: () => updateGeneral.mutateAsync(general),
        operating: () => updateOperating.mutateAsync(operating),
        payment: () => updatePayment.mutateAsync(payment),
        notifications: () => updateNotifications.mutateAsync(notifications),
        security: () => updateSecurity.mutateAsync(security),
      };
      await map[section]();
      toast.success('Settings saved', 'Changes are now live.');
    } catch {
      toast.error('Save failed', 'Unable to save the changes.');
    }
  };

  const activeMutation = {
    general: updateGeneral,
    operating: updateOperating,
    payment: updatePayment,
    notifications: updateNotifications,
    security: updateSecurity,
  }[section];

  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Configure the platform, payments, notifications, and security."
        actions={
          <Button onClick={saveSection} loading={activeMutation.isPending}>
            Save Changes
          </Button>
        }
      />

      <div className="mb-6">
        <Tabs
          items={sections.map((item) => ({ key: item.value, label: item.label }))}
          value={section}
          onChange={(value) => setSection(value as SettingsSection)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {section === 'general' && (
            <>
              <Card title="General" subtitle="Brand and contact information">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="App name" value={general.appName} onChange={(event) => setGeneral({ ...general, appName: event.target.value })} />
                  <Input label="Tagline" value={general.tagline} onChange={(event) => setGeneral({ ...general, tagline: event.target.value })} />
                  <Input label="Support email" type="email" value={general.supportEmail} onChange={(event) => setGeneral({ ...general, supportEmail: event.target.value })} />
                  <Input label="Support phone" value={general.supportPhone} onChange={(event) => setGeneral({ ...general, supportPhone: event.target.value })} />
                  <Select
                    label="Currency"
                    value={general.currency}
                    onChange={(event) => setGeneral({ ...general, currency: event.target.value })}
                    options={[{ label: 'PHP (₱)', value: 'PHP (₱)' }, { label: 'USD ($)', value: 'USD ($)' }, { label: 'EUR (€)', value: 'EUR (€)' }]}
                  />
                  <Select
                    label="Language"
                    value={general.language}
                    onChange={(event) => setGeneral({ ...general, language: event.target.value })}
                    options={[{ label: 'English (US)', value: 'English (US)' }, { label: 'Filipino', value: 'Filipino' }]}
                  />
                  <Select
                    label="Timezone"
                    value={general.timezone}
                    onChange={(event) => setGeneral({ ...general, timezone: event.target.value })}
                    options={[{ label: 'Asia/Manila (UTC+8)', value: 'Asia/Manila (UTC+8)' }]}
                  />
                  <Input
                    label="App version"
                    value={general.appVersion}
                    onChange={(event) => setGeneral({ ...general, appVersion: event.target.value })}
                  />
                </div>
              </Card>

              <Card title="Branding" subtitle="App appearance on riders' devices">
                <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 font-extrabold text-white">
                      {general.appName.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{general.appName}</p>
                      <p className="text-xs text-slate-400">{general.tagline}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Upload ready', 'Logo uploads are simulated in this demo.')}>
                    Upload Logo
                  </Button>
                </div>
              </Card>
            </>
          )}

          {section === 'operating' && (
            <Card title="Operating Rules" subtitle="Booking window, commissions, and safety">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Default booking window (min)"
                  type="number"
                  value={operating.defaultBookingWindowMin}
                  onChange={(event) => setOperating({ ...operating, defaultBookingWindowMin: Number(event.target.value) })}
                />
                <Input
                  label="Max concurrent bookings / driver"
                  type="number"
                  value={operating.maxConcurrentBookings}
                  onChange={(event) => setOperating({ ...operating, maxConcurrentBookings: Number(event.target.value) })}
                />
                <Input
                  label="Driver commission (%)"
                  type="number"
                  value={operating.driverCommissionPercent}
                  onChange={(event) => setOperating({ ...operating, driverCommissionPercent: Number(event.target.value) })}
                />
                <Input
                  label="Cancellation window (min)"
                  type="number"
                  value={operating.cancellationWindowMin}
                  onChange={(event) => setOperating({ ...operating, cancellationWindowMin: Number(event.target.value) })}
                />
              </div>
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <Toggle
                  label="Safety checks"
                  description="Require photo check-in before each trip"
                  checked={operating.safetyChecks}
                  onChange={(checked) => setOperating({ ...operating, safetyChecks: checked })}
                />
                <Toggle
                  label="Auto-assign drivers"
                  description="Closest available driver is assigned automatically"
                  checked={operating.autoAssignDrivers}
                  onChange={(checked) => setOperating({ ...operating, autoAssignDrivers: checked })}
                />
                <Toggle
                  label="Weekend dynamic pricing"
                  description="Apply surge multipliers on weekend rush hours"
                  checked={operating.weekendDynamicPricing}
                  onChange={(checked) => setOperating({ ...operating, weekendDynamicPricing: checked })}
                />
              </div>
            </Card>
          )}

          {section === 'payment' && (
            <Card title="Payments & Payouts" subtitle="Gateway, schedule, and accepted methods">
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Payment gateway"
                  value={payment.gateway}
                  onChange={(event) => setPayment({ ...payment, gateway: event.target.value as PaymentSettings['gateway'] })}
                  options={[{ label: 'GCash', value: 'GCash' }, { label: 'PayMongo', value: 'PayMongo' }, { label: 'PayPal', value: 'PayPal' }]}
                />
                <Select
                  label="Payout schedule"
                  value={payment.payoutSchedule}
                  onChange={(event) => setPayment({ ...payment, payoutSchedule: event.target.value as PaymentSettings['payoutSchedule'] })}
                  options={[{ label: 'Daily', value: 'Daily' }, { label: 'Weekly', value: 'Weekly' }, { label: 'Bi-weekly', value: 'Bi-weekly' }]}
                />
                <Input
                  label="Refund window (hours)"
                  type="number"
                  value={payment.refundWindowHours}
                  onChange={(event) => setPayment({ ...payment, refundWindowHours: Number(event.target.value) })}
                />
              </div>
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <Toggle
                  label="Auto payouts"
                  description="Pay out driver earnings automatically on schedule"
                  checked={payment.autoPayoutEnabled}
                  onChange={(checked) => setPayment({ ...payment, autoPayoutEnabled: checked })}
                />
                <Toggle
                  label="Cash payments"
                  description="Allow passengers to pay cash in person"
                  checked={payment.cashEnabled}
                  onChange={(checked) => setPayment({ ...payment, cashEnabled: checked })}
                />
                <Toggle
                  label="Card payments"
                  description="Accept debit and credit card payments"
                  checked={payment.cardEnabled}
                  onChange={(checked) => setPayment({ ...payment, cardEnabled: checked })}
                />
              </div>
            </Card>
          )}

          {section === 'notifications' && (
            <Card title="Notification Channels" subtitle="Where riders receive updates">
              <div className="space-y-4">
                <Toggle
                  label="Email notifications"
                  description="Booking receipts and weekly digests"
                  checked={notifications.emailEnabled}
                  onChange={(checked) => setNotifications({ ...notifications, emailEnabled: checked })}
                />
                <Toggle
                  label="Push notifications"
                  description="Real-time booking and trip alerts"
                  checked={notifications.pushEnabled}
                  onChange={(checked) => setNotifications({ ...notifications, pushEnabled: checked })}
                />
                <Toggle
                  label="SMS notifications"
                  description="OTP and critical trip alerts via text"
                  checked={notifications.smsEnabled}
                  onChange={(checked) => setNotifications({ ...notifications, smsEnabled: checked })}
                />
                <Toggle
                  label="Booking reminders"
                  description="Remind passengers before scheduled trips"
                  checked={notifications.bookingReminders}
                  onChange={(checked) => setNotifications({ ...notifications, bookingReminders: checked })}
                />
                <Toggle
                  label="Promo emails"
                  description="Send marketing and promo campaigns"
                  checked={notifications.promoEmails}
                  onChange={(checked) => setNotifications({ ...notifications, promoEmails: checked })}
                />
                <Toggle
                  label="Driver alerts"
                  description="Notify drivers about policy updates"
                  checked={notifications.driverAlerts}
                  onChange={(checked) => setNotifications({ ...notifications, driverAlerts: checked })}
                />
              </div>
            </Card>
          )}

          {section === 'security' && (
            <Card title="Security" subtitle="Account protection and session policy">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Password expiry (days)"
                  type="number"
                  value={security.passwordExpiryDays}
                  onChange={(event) => setSecurity({ ...security, passwordExpiryDays: Number(event.target.value) })}
                />
                <Input
                  label="Session timeout (minutes)"
                  type="number"
                  value={security.sessionTimeoutMin}
                  onChange={(event) => setSecurity({ ...security, sessionTimeoutMin: Number(event.target.value) })}
                />
                <Input
                  label="Max login attempts"
                  type="number"
                  value={security.maxLoginAttempts}
                  onChange={(event) => setSecurity({ ...security, maxLoginAttempts: Number(event.target.value) })}
                />
              </div>
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <Toggle
                  label="Require two-factor authentication"
                  description="Admins must verify with an OTP at sign-in"
                  checked={security.twoFactorRequired}
                  onChange={(checked) => setSecurity({ ...security, twoFactorRequired: checked })}
                />
                <Toggle
                  label="IP allowlist"
                  description="Only allow dashboard access from listed IPs"
                  checked={security.ipAllowlistEnabled}
                  onChange={(checked) => setSecurity({ ...security, ipAllowlistEnabled: checked })}
                />
                {security.ipAllowlistEnabled && (
                  <Input
                    label="Allowed IP ranges"
                    value={security.ipAllowlist}
                    onChange={(event) => setSecurity({ ...security, ipAllowlist: event.target.value })}
                  />
                )}
                <Toggle
                  label="Force strong passwords"
                  description="Require 12+ chars with mixed case and symbols"
                  checked={security.forceStrongPasswords}
                  onChange={(checked) => setSecurity({ ...security, forceStrongPasswords: checked })}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Section" subtitle="Current selection">
            <ul className="space-y-1">
              {sections.map((item) => (
                <li key={item.value}>
                  <button
                    type="button"
                    onClick={() => setSection(item.value)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      section === item.value ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={16} className={section === item.value ? 'text-primary-500' : 'text-slate-400'} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Danger Zone" subtitle="Destructive actions">
            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              Resetting the platform restores factory settings. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => toast.error('Action blocked', 'Platform reset is disabled in this demo.')}
            >
              <FiShield size={14} /> Reset Platform
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
