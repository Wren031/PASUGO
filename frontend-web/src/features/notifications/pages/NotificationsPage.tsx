import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiBell, FiCheckCircle, FiClock, FiMail, FiMessageSquare, FiPlus, FiSend } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useCreateNotification, useNotificationStats, useNotifications } from '../hooks/useNotifications';
import { formatDateTime } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { AppNotification, NotificationChannel, NotificationCreatePayload } from '../types';

const channelTone: Record<NotificationChannel, 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'purple' | 'slate'> = {
  Push: 'blue',
  Email: 'green',
  SMS: 'amber',
  Promotional: 'indigo',
  Emergency: 'red',
  Scheduled: 'purple',
  Draft: 'slate',
};

const channelStats: Record<NotificationChannel, { icon: typeof FiBell; label: string }> = {
  Push: { icon: FiBell, label: 'Push notifications' },
  Email: { icon: FiMail, label: 'Email notifications' },
  SMS: { icon: FiMessageSquare, label: 'SMS notifications' },
  Promotional: { icon: FiSend, label: 'Promotional notifications' },
  Emergency: { icon: FiBell, label: 'Emergency alerts' },
  Scheduled: { icon: FiClock, label: 'Scheduled notifications' },
  Draft: { icon: FiCheckCircle, label: 'Draft notifications' },
};

export default function NotificationsPage() {
  const { data: stats } = useNotificationStats();
  const { data: notifications, isLoading } = useNotifications();
  const createMutation = useCreateNotification();
  const [tab, setTab] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationCreatePayload>({
    defaultValues: { channel: 'Push', title: '', message: '', audience: 'All passengers', schedule: '' },
  });

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: notifications?.length },
    ...(['Push', 'Email', 'SMS', 'Promotional', 'Emergency', 'Scheduled'] as NotificationChannel[]).map((channel) => ({
      key: channel,
      label: channel,
      count: notifications?.filter((n) => n.channel === channel).length,
    })),
  ];

  const filtered = useMemo(() => {
    return (notifications ?? []).filter((notification) => tab === 'all' || notification.channel === tab);
  }, [notifications, tab]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        schedule: values.schedule || undefined,
      });
      toast.success(values.schedule ? 'Notification scheduled' : 'Notification sent', `${values.title} (${values.channel})`);
      setCreateOpen(false);
      reset();
    } catch {
      toast.error('Action failed', 'Unable to create the notification.');
    }
  });

  const columns: Array<Column<AppNotification>> = [
    { key: 'channel', header: 'Channel', cell: (row) => <Badge tone={channelTone[row.channel]}>{row.channel}</Badge> },
    {
      key: 'message',
      header: 'Notification',
      cell: (row) => (
        <div className="max-w-[300px]">
          <p className="truncate font-semibold text-slate-900">{row.title}</p>
          <p className="truncate text-xs text-slate-500">{row.message}</p>
        </div>
      ),
    },
    { key: 'audience', header: 'Audience', cell: (row) => <span className="text-slate-600">{row.audience}</span> },
    {
      key: 'reach',
      header: 'Reach',
      align: 'right',
      cell: (row) => (
        <span className="font-semibold text-slate-800">
          {row.sentCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {row.targetCount.toLocaleString()}</span>
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (row) => <span className="text-xs text-slate-500">{row.sentAt ? formatDateTime(row.sentAt) : row.scheduledAt ? `Scheduled ${formatDateTime(row.scheduledAt)}` : '—'}</span>,
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Push, email, SMS, promotional, emergency, and scheduled notifications."
        actions={
          <Button icon={<FiPlus size={15} />} onClick={() => setCreateOpen(true)}>
            Create Notification
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Push Notifications Sent" value={(stats?.pushSent ?? 0).toLocaleString()} icon={FiBell} tone="blue" />
        <StatCard label="Emails Sent" value={(stats?.emailSent ?? 0).toLocaleString()} icon={FiMail} tone="green" />
        <StatCard label="SMS Sent" value={(stats?.smsSent ?? 0).toLocaleString()} icon={FiMessageSquare} tone="amber" />
        <StatCard label="Delivery Rate" value={`${stats?.deliveryRate ?? 0}%`} icon={FiCheckCircle} tone="green" delta={`${stats?.scheduled ?? 0} scheduled`} />
      </div>

      <Card title="Notification History" subtitle="All notifications sent across channels" bodyClassName="p-0">
        <div className="px-5 pt-4">
          <Tabs items={tabs} value={tab} onChange={setTab} className="-mx-1" />
        </div>
        <div className="p-5">
          <DataTable
            columns={columns}
            data={paginated}
            rowKey={(row) => row.id}
            loading={isLoading}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            emptyTitle="No notifications"
            emptyDescription="Notifications you send will appear here."
          />
        </div>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Notification"
        subtitle="Send or schedule a message to your audience"
        size="md"
      >
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Select
            label="Channel"
            options={Object.entries(channelStats).map(([value, config]) => ({ value, label: config.label }))}
            {...register('channel')}
          />
          <Input
            label="Title"
            placeholder="e.g. Weekend Ride Discount"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Textarea
            label="Message"
            placeholder="Write your notification message…"
            rows={4}
            error={errors.message?.message}
            {...register('message', { required: 'Message is required', maxLength: { value: 500, message: 'Maximum 500 characters' } })}
          />
          <Input
            label="Audience"
            placeholder="e.g. All passengers, drivers in Makati, etc."
            error={errors.audience?.message}
            {...register('audience', { required: 'Audience is required' })}
          />
          <Input
            label="Schedule (optional)"
            type="datetime-local"
            hint="Leave empty to send immediately"
            {...register('schedule')}
          />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Send Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
