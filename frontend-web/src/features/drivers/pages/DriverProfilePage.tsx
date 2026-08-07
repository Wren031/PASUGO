import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiShieldOff, FiTruck } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import StatusBadge from '@/components/common/StatusBadge';
import InfoRow from '@/components/common/InfoRow';
import RatingStars from '@/components/ui/RatingStars';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import DataTable, { type Column } from '@/components/tables/DataTable';
import PageLoader from '@/components/loading/PageLoader';
import TrendLineChart from '@/components/charts/TrendLineChart';
import { useDriver, useDriverStatusMutation } from '../hooks/useDrivers';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { DriverTrip } from '../types';

const documentTone: Record<string, 'green' | 'amber' | 'red' | 'blue'> = {
  Approved: 'green',
  Pending: 'amber',
  Rejected: 'red',
  Resubmission: 'blue',
};

export default function DriverProfilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: driver, isLoading } = useDriver(id);
  const statusMutation = useDriverStatusMutation();
  const [tab, setTab] = useState('overview');
  const [confirmAction, setConfirmAction] = useState<'suspend' | 'activate' | null>(null);

  if (isLoading || !driver) {
    return <PageLoader />;
  }

  const tabs: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'performance', label: 'Performance' },
    { key: 'documents', label: 'Documents' },
    { key: 'trips', label: 'Trip History', count: driver.tripHistory.length },
  ];

  const tripColumns: Array<Column<DriverTrip>> = [
    { key: 'id', header: 'Booking ID', cell: (row) => <span className="font-semibold text-primary-600">{row.id}</span> },
    { key: 'date', header: 'Date & Time', cell: (row) => <span className="text-slate-600">{formatDateTime(row.date)}</span> },
    { key: 'passenger', header: 'Passenger', cell: (row) => <span className="text-slate-700">{row.passengerName}</span> },
    { key: 'route', header: 'Route', cell: (row) => <span className="text-slate-700">{row.route}</span> },
    { key: 'fare', header: 'Fare', align: 'right', cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.fare)}</span> },
    { key: 'rating', header: 'Passenger Rating', align: 'center', cell: (row) => (row.rating ? <RatingStars value={row.rating} size={12} /> : <span className="text-slate-300">—</span>) },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleStatusChange = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction === 'suspend') {
        await statusMutation.mutateAsync({ id: driver.id, action: 'suspend' });
        toast.success('Driver suspended', `${driver.name} can no longer accept rides.`);
      } else {
        await statusMutation.mutateAsync({ id: driver.id, action: 'activate' });
        toast.success('Driver activated', `${driver.name} can accept rides again.`);
      }
    } catch {
      toast.error('Action failed', 'Unable to update the driver status.');
    }
    setConfirmAction(null);
  };

  const distributionTotal = driver.ratingSummary.total || 1;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/admin/drivers')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-600"
      >
        <FiArrowLeft size={15} /> Back to drivers
      </button>

      <PageHeader
        title={driver.name}
        description={`Driver since ${formatDate(driver.joinedAt)}`}
        badge={<StatusBadge status={driver.status} />}
        actions={
          driver.status === 'Suspended' ? (
            <Button variant="outline" icon={<FiShield size={15} />} onClick={() => setConfirmAction('activate')}>
              Activate Driver
            </Button>
          ) : (
            <Button variant="danger" icon={<FiShieldOff size={15} />} onClick={() => setConfirmAction('suspend')}>
              Suspend Driver
            </Button>
          )
        }
      />

      <Tabs items={tabs} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <Avatar name={driver.name} size="xl" status={driver.availability === 'Offline' ? 'offline' : driver.availability === 'On Trip' ? 'busy' : 'online'} />
              <div>
                <p className="text-base font-bold text-slate-900">{driver.name}</p>
                <p className="text-sm text-slate-500">{driver.email}</p>
                <p className="mt-1 text-xs text-slate-400">{driver.phone}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingStars value={driver.rating} size={14} showValue />
                <span className="text-xs text-slate-400">({driver.ratingSummary.total} reviews)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <StatusBadge status={driver.availability} />
                <Badge tone="slate">{driver.yearsExperience} yrs exp</Badge>
              </div>
            </div>
          </Card>

          <Card title="Driver Details" className="lg:col-span-2">
            <InfoRow label="Total Trips" value={driver.totalTrips.toLocaleString()} strong />
            <InfoRow label="Total Earnings" value={formatCurrency(driver.totalEarnings)} strong />
            <InfoRow label="Motorcycle" value={`${driver.motorcycle} · ${driver.plateNumber}`} />
            <InfoRow label="Years of Experience" value={`${driver.yearsExperience} years`} />
            <div className="my-3 border-t border-slate-100" />
            <InfoRow label="Documents" value="License, OR/CR & NBI — all approved" />
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <FiTruck size={14} className="mt-0.5 shrink-0 text-slate-400" />
              Vehicle last inspected on July 15, 2026. Next maintenance check due October 2026.
            </div>
          </Card>
        </div>
      )}

      {tab === 'performance' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Weekly Performance" subtitle="Trips and earnings for the current week" bodyClassName="p-4">
            <TrendLineChart
              data={driver.weeklyPerformance.map((day) => ({ label: day.label, trips: day.trips, earnings: day.earnings }))}
              series={[
                { name: 'Earnings', dataKey: 'earnings', color: '#F97316' },
              ]}
              height={260}
            />
          </Card>
          <Card title="Rating Breakdown" subtitle={`Based on ${driver.ratingSummary.total} passenger reviews`}>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star} className="mb-3 flex items-center gap-3">
                <span className="w-8 text-xs font-semibold text-slate-500">{star} ★</span>
                <ProgressBar
                  value={driver.ratingSummary.distribution[star]}
                  max={distributionTotal}
                  tone={star >= 4 ? 'green' : star === 3 ? 'orange' : 'red'}
                  className="flex-1"
                />
                <span className="w-10 text-right text-xs text-slate-500">{driver.ratingSummary.distribution[star]}</span>
              </div>
            ))}
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700">
              {driver.rating >= 4.7
                ? 'Excellent performer — eligible for weekly incentive bonuses.'
                : driver.rating >= 4.5
                  ? 'Good performer — within acceptable rating range.'
                  : 'Below target rating — a review meeting with operations is recommended.'}
            </div>
          </Card>
        </div>
      )}

      {tab === 'documents' && (
        <Card title="Driver Documents" subtitle="Compliance documents on file">
          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                { label: "Driver's License", doc: driver.documents.license, meta: 'Licensing Authority' },
                { label: 'OR/CR', doc: driver.documents.orcr, meta: 'LTO Registration' },
                { label: 'NBI Clearance', doc: driver.documents.nbi, meta: 'Background Check' },
              ] as const
            ).map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <Badge tone={documentTone[item.doc.status]}>{item.doc.status}</Badge>
                  <span className="text-[11px] text-slate-400">{item.meta}</span>
                </div>
                {item.doc.note && <p className="mt-3 text-xs leading-relaxed text-slate-600">{item.doc.note}</p>}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3.5 text-xs leading-relaxed text-blue-700">
            All documents are securely stored and visible to the driver in the HatodGo driver app.
          </div>
        </Card>
      )}

      {tab === 'trips' && (
        <Card title="Trip History" subtitle={`Latest ${driver.tripHistory.length} trips`}>
          <DataTable
            columns={tripColumns}
            data={driver.tripHistory}
            rowKey={(row) => row.id}
            emptyTitle="No trips recorded"
            emptyDescription="Trip history will appear once the driver completes rides."
          />
        </Card>
      )}

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === 'suspend' ? 'Suspend driver account' : 'Activate driver account'}
        message={
          confirmAction === 'suspend'
            ? `Are you sure you want to suspend ${driver.name}? They will be immediately removed from active dispatch.`
            : `Are you sure you want to reactivate ${driver.name}? They will return to the dispatch pool.`
        }
        confirmLabel={confirmAction === 'suspend' ? 'Suspend Driver' : 'Activate Driver'}
        tone={confirmAction === 'suspend' ? 'danger' : 'primary'}
        loading={statusMutation.isPending}
        onConfirm={handleStatusChange}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
