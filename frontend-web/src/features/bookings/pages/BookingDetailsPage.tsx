import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus, FiXCircle } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import InfoRow from '@/components/common/InfoRow';
import RatingStars from '@/components/ui/RatingStars';
import StatusBadge from '@/components/common/StatusBadge';
import Timeline from '@/components/common/Timeline';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import PageLoader from '@/components/loading/PageLoader';
import { useAssignDriver, useAvailableDrivers, useBooking, useCancelBooking } from '../hooks/useBookings';
import { formatCurrency, formatDateTime, minutesToLabel } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { AvailableDriver } from '../types';

export default function BookingDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: booking, isLoading } = useBooking(id);
  const { data: drivers } = useAvailableDrivers();
  const assignMutation = useAssignDriver();
  const cancelMutation = useCancelBooking();
  const [assignOpen, setAssignOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (isLoading || !booking) {
    return <PageLoader />;
  }

  const isActive = !['Completed', 'Cancelled'].includes(booking.status);
  const isAssignable = ['Pending', 'Searching Driver'].includes(booking.status);

  const fareItems = [
    { label: `Base fare`, value: booking.fare.baseFare },
    { label: `Distance (${booking.distanceKm} km × ₱12)`, value: booking.fare.distanceCharge },
    { label: `Time (${booking.durationMin} min × ₱2)`, value: booking.fare.timeCharge },
    { label: `Booking fee`, value: booking.fare.bookingFee },
  ];

  const handleAssign = async (driver: AvailableDriver) => {
    try {
      await assignMutation.mutateAsync({ bookingId: booking.id, driverId: driver.id, driverName: driver.name });
      toast.success('Driver assigned', `${driver.name} has been assigned to ${booking.id}.`);
      setAssignOpen(false);
    } catch {
      toast.error('Assignment failed', 'Unable to assign the driver to this booking.');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(booking.id);
      toast.error('Booking cancelled', `${booking.id} has been cancelled.`);
      setConfirmCancel(false);
    } catch {
      toast.error('Cancel failed', 'Unable to cancel this booking.');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/admin/bookings')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-600"
      >
        <FiArrowLeft size={15} /> Back to bookings
      </button>

      <PageHeader
        title={`Booking ${booking.id}`}
        description={`Booked ${formatDateTime(booking.bookedAt)} · ${booking.paymentMethod} payment`}
        badge={<StatusBadge status={booking.status} />}
        actions={
          isAssignable ? (
            <Button icon={<FiUserPlus size={15} />} onClick={() => setAssignOpen(true)}>
              Assign Driver
            </Button>
          ) : isActive ? (
            <Button variant="danger" icon={<FiXCircle size={15} />} onClick={() => setConfirmCancel(true)}>
              Cancel Booking
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Route Details">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span className="h-3 w-3 rounded-full bg-primary-500" />
                <span className="my-1 w-0.5 flex-1 border-l-2 border-dashed border-slate-300" />
                <span className="h-3 w-3 rounded-full bg-blue-500" />
              </div>
              <div className="flex-1 space-y-6 py-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pickup</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{booking.pickup}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Drop-off</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{booking.dropoff}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right text-xs text-slate-500">
                <span className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold">{booking.distanceKm} km</span>
                <span className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold">{minutesToLabel(booking.durationMin)}</span>
              </div>
            </div>
          </Card>

          <Card title="Trip Timeline" subtitle="Lifecycle of this booking">
            <Timeline items={booking.timeline} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Passenger">
            <div className="flex items-center gap-3">
              <Avatar name={booking.passengerName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{booking.passengerName}</p>
                <p className="text-xs text-slate-500">{booking.passengerPhone}</p>
              </div>
              <Badge tone="green">Verified</Badge>
            </div>
          </Card>

          <Card title="Driver">
            {booking.driverName ? (
              <div className="flex items-center gap-3">
                <Avatar name={booking.driverName} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{booking.driverName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <RatingStars value={booking.driverRating ?? 0} size={11} />
                    {booking.driverRating?.toFixed(1)}
                  </p>
                </div>
                <Badge tone="blue">Assigned</Badge>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No driver assigned yet. {isAssignable ? 'Assign a driver from the dispatch pool.' : ''}
              </p>
            )}
          </Card>

          <Card title="Fare Breakdown" subtitle={`Surge multiplier ×${booking.fare.surgeMultiplier.toFixed(1)}`}>
            {fareItems.map((item) => (
              <InfoRow key={item.label} label={item.label} value={formatCurrency(item.value)} />
            ))}
            {booking.fare.discount > 0 && (
              <InfoRow label="Discount applied" value={`−${formatCurrency(booking.fare.discount)}`} />
            )}
            <div className="my-2 border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total</span>
              <span className="text-lg font-extrabold text-primary-600">{formatCurrency(booking.fare.total)}</span>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Driver"
        subtitle="Select a nearby available driver for this booking"
        size="md"
      >
        <ul className="divide-y divide-slate-100">
          {drivers?.map((driver) => (
            <li key={driver.id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
              <Avatar name={driver.name} size="md" status="online" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{driver.name}</p>
                <p className="text-xs text-slate-500">
                  <RatingStars value={driver.rating} size={11} /> · {driver.trips.toLocaleString()} trips
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-semibold text-slate-700">{driver.distanceKm} km away</p>
                <p>ETA {driver.etaMin} min</p>
              </div>
              <Button
                size="sm"
                loading={assignMutation.isPending}
                onClick={() => handleAssign(driver)}
                disabled={assignMutation.isPending}
              >
                Assign
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          The driver will receive a push notification and 60 seconds to accept the assignment.
        </p>
      </Modal>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this booking?"
        message={`${booking.id} will be marked as cancelled. The passenger will be notified and the driver (if assigned) will be released.`}
        confirmLabel="Cancel Booking"
        tone="danger"
        loading={cancelMutation.isPending}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}
