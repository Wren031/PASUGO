import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';
import StatusBadge from '@/components/common/StatusBadge';
import { formatCurrency } from '@/utils/format';
import type { LatestBooking, LiveDriverStatus, TopDriver } from '../types';
import { cn } from '@/lib/utils';

const availabilityTone: Record<LiveDriverStatus['status'], string> = {
  Online: 'bg-green-500',
  'On Trip': 'bg-primary-500',
  Offline: 'bg-slate-300',
};

export function LiveDriverList({ drivers }: { drivers: LiveDriverStatus[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {drivers.map((driver) => (
        <li key={driver.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
          <div className="relative">
            <Avatar name={driver.name} size="sm" />
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
                availabilityTone[driver.status],
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link to={`/admin/drivers/${driver.id}`} className="text-sm font-semibold text-slate-800 hover:text-primary-600">
              {driver.name}
            </Link>
            <p className="text-xs text-slate-400">
              {driver.tripsToday} trips · {formatCurrency(driver.earningsToday)} today
            </p>
          </div>
          <div className="text-right">
            <StatusBadge status={driver.status} />
            <p className="mt-1 text-xs text-slate-400">
              <RatingStars value={driver.rating} size={10} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TopDriverList({ drivers }: { drivers: TopDriver[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {drivers.map((driver, index) => (
        <li key={driver.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
            {index + 1}
          </span>
          <Avatar name={driver.name} size="sm" />
          <div className="min-w-0 flex-1">
            <Link to={`/admin/drivers/${driver.id}`} className="block truncate text-sm font-semibold text-slate-800 hover:text-primary-600">
              {driver.name}
            </Link>
            <p className="text-xs text-slate-400">
              <RatingStars value={driver.rating} size={10} /> · {driver.trips.toLocaleString()} trips
            </p>
          </div>
          <span className="text-sm font-bold text-slate-900">{formatCurrency(driver.earnings)}</span>
        </li>
      ))}
    </ul>
  );
}

export function LatestBookingList({ bookings }: { bookings: LatestBooking[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {bookings.map((booking) => (
        <li key={booking.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <FiBookOpen size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <Link
              to={`/admin/bookings/${booking.id}`}
              className="block truncate text-sm font-semibold text-slate-800 hover:text-primary-600"
            >
              {booking.id} · {booking.route}
            </Link>
            <p className="truncate text-xs text-slate-400">
              {booking.passengerName} {booking.driverName ? `· ${booking.driverName}` : ''} · {booking.time}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-slate-900">{formatCurrency(booking.fare)}</p>
            <StatusBadge status={booking.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ViewAllLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700"
    >
      {label} <FiArrowRight size={14} />
    </Link>
  );
}
