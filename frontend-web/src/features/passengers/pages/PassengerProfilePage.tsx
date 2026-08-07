import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiShieldOff, FiShield, FiMapPin } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import StatusBadge from '@/components/common/StatusBadge';
import InfoRow from '@/components/common/InfoRow';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import DataTable, { type Column } from '@/components/tables/DataTable';
import PageLoader from '@/components/loading/PageLoader';
import EmptyState from '@/components/common/EmptyState';
import { usePassenger, usePassengerStatusMutation } from '../hooks/usePassengers';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { PassengerBooking } from '../types';

export default function PassengerProfilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: passenger, isLoading } = usePassenger(id);
  const statusMutation = usePassengerStatusMutation();
  const [tab, setTab] = useState('overview');
  const [confirmAction, setConfirmAction] = useState<'suspend' | 'activate' | null>(null);

  if (isLoading || !passenger) {
    return <PageLoader />;
  }

  const tabs: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'bookingHistory', label: 'Booking History', count: passenger.bookingHistory.length },
  ];

  const bookingColumns: Array<Column<PassengerBooking>> = [
    { key: 'id', header: 'Booking ID', cell: (row) => <span className="font-semibold text-primary-600">{row.id}</span> },
    { key: 'date', header: 'Date & Time', cell: (row) => <span className="text-slate-600">{formatDateTime(row.date)}</span> },
    { key: 'route', header: 'Route', cell: (row) => <span className="text-slate-700">{row.route}</span> },
    { key: 'fare', header: 'Fare', align: 'right', cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.fare)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleStatusChange = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction === 'suspend') {
        await statusMutation.mutateAsync({ id: passenger.id, action: 'suspend' });
        toast.success('Passenger suspended', `${passenger.name} can no longer book rides.`);
      } else {
        await statusMutation.mutateAsync({ id: passenger.id, action: 'activate' });
        toast.success('Passenger activated', `${passenger.name} can book rides again.`);
      }
    } catch {
      toast.error('Action failed', 'Unable to update the passenger status.');
    }
    setConfirmAction(null);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/admin/passengers')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-600"
      >
        <FiArrowLeft size={15} /> Back to passengers
      </button>

      <PageHeader
        title={passenger.name}
        description={`Passenger since ${formatDate(passenger.joinedAt)}`}
        badge={<StatusBadge status={passenger.status} />}
        actions={
          passenger.status === 'Suspended' ? (
            <Button
              variant="outline"
              icon={<FiShield size={15} />}
              onClick={() => setConfirmAction('activate')}
            >
              Activate Account
            </Button>
          ) : (
            <Button
              variant="danger"
              icon={<FiShieldOff size={15} />}
              onClick={() => setConfirmAction('suspend')}
            >
              Suspend Account
            </Button>
          )
        }
      />

      <Tabs items={tabs} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'overview' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <Avatar name={passenger.name} size="xl" />
              <div>
                <p className="text-base font-bold text-slate-900">{passenger.name}</p>
                <p className="text-sm text-slate-500">{passenger.email}</p>
                <p className="mt-1 text-xs text-slate-400">{passenger.phone}</p>
              </div>
              <div className="flex gap-2">
                {passenger.identityVerified ? (
                  <Badge tone="green">Identity Verified</Badge>
                ) : (
                  <Badge tone="amber">Identity Unverified</Badge>
                )}
                <Badge tone="slate">{passenger.preferredPayment} payment</Badge>
              </div>
            </div>
          </Card>

          <Card title="Account Details" className="lg:col-span-2">
            <InfoRow label="Total Bookings" value={passenger.totalBookings.toLocaleString()} strong />
            <InfoRow label="Total Spent" value={formatCurrency(passenger.totalSpent)} strong />
            <InfoRow label="Average Rating" value={`${passenger.rating.toFixed(1)} / 5.0`} />
            <InfoRow label="Preferred Payment" value={passenger.preferredPayment} />
            <div className="my-3 border-t border-slate-100" />
            <InfoRow label="Home Location" value={passenger.homeLocation} />
            <InfoRow label="Work Location" value={passenger.workLocation} />
            <div className="my-3 border-t border-slate-100" />
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <FiMapPin size={14} className="mt-0.5 shrink-0" />
              Frequent routes: Cubao ↔ BGC, Makati ↔ Ortigas, and EDSA corridor.
            </div>
          </Card>
        </div>
      ) : (
        <Card title="Booking History" subtitle={`Last ${passenger.bookingHistory.length} bookings`}>
          <DataTable
            columns={bookingColumns}
            data={passenger.bookingHistory}
            rowKey={(row) => row.id}
            emptyTitle="No bookings yet"
            emptyDescription="This passenger has not completed any bookings."
          />
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 p-3.5">
            <FiMail size={15} className="mt-0.5 shrink-0 text-blue-500" />
            <div className="text-xs leading-relaxed text-blue-700">
              <p className="font-bold">Contact passenger</p>
              <p>Email: {passenger.email} · Phone: {passenger.phone}</p>
            </div>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === 'suspend' ? 'Suspend passenger account' : 'Activate passenger account'}
        message={
          confirmAction === 'suspend'
            ? `Are you sure you want to suspend ${passenger.name}? They will no longer be able to book rides until the account is reactivated.`
            : `Are you sure you want to reactivate ${passenger.name}'s account? They will be able to book rides immediately.`
        }
        confirmLabel={confirmAction === 'suspend' ? 'Suspend Account' : 'Activate Account'}
        tone={confirmAction === 'suspend' ? 'danger' : 'primary'}
        loading={statusMutation.isPending}
        onConfirm={handleStatusChange}
        onCancel={() => setConfirmAction(null)}
      />

      {passenger.bookingHistory.length === 0 && (
        <EmptyState title="No booking history" description="Ride history will appear here once the passenger completes a trip." />
      )}
    </div>
  );
}
