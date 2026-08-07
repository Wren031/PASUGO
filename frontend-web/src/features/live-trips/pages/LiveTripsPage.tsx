import { FiActivity, FiClock, FiCheckCircle, FiUsers } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import MapPlaceholder from '@/components/common/MapPlaceholder';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import PageLoader from '@/components/loading/PageLoader';
import { useLiveTrips, useTripStats } from '../hooks/useLiveTrips';
import { formatNumber, minutesToLabel, timeAgo } from '@/utils/format';
import type { LiveTrip } from '../types';

export default function LiveTripsPage() {
  const { data: stats } = useTripStats();
  const { data: trips, isLoading } = useLiveTrips();

  return (
    <div>
      <PageHeader
        title="Live Trip Monitoring"
        description="Track active trips, driver locations, and ETAs in real time."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Trips" value={formatNumber(stats?.activeTrips ?? 0)} icon={FiActivity} tone="orange" />
        <StatCard label="Drivers Online" value={formatNumber(stats?.driversOnline ?? 0)} icon={FiUsers} tone="blue" />
        <StatCard label="Average ETA" value={stats ? `${stats.avgEtaMin} min` : '—'} icon={FiClock} tone="cyan" />
        <StatCard label="Completed Today" value={formatNumber(stats?.completedToday ?? 0)} icon={FiCheckCircle} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card
          title="Active Trips Map"
          subtitle="Real-time positions of all ongoing rides"
          className="xl:col-span-3"
          bodyClassName="p-4"
        >
          <MapPlaceholder pickup="Metro Manila" dropoff="Live GPS feed" driverLabel="142 riders" eta="live" className="h-[420px]" zoom />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {([['Quezon City', 46], ['Makati', 31], ['Taguig', 24]] as const).map(([zone, count]) => (
              <div key={zone} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-xs font-semibold text-slate-700">{zone}</p>
                <p className="mt-1 text-lg font-extrabold text-primary-600">{count}</p>
                <p className="text-[10px] text-slate-400">active trips</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="xl:col-span-2">
          <Card
            title="Active Rides"
            subtitle={`${trips?.length ?? 0} trips currently in progress`}
            bodyClassName="p-4"
          >
            {isLoading ? (
              <PageLoader />
            ) : (
              <ul className="space-y-4">
                {trips?.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: LiveTrip }) {
  return (
    <li className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-primary-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={trip.driverName} size="sm" status="busy" />
          <div>
            <p className="text-sm font-bold text-slate-900">{trip.driverName}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <RatingStars value={trip.driverRating} size={10} /> · {trip.bookingId}
            </p>
          </div>
        </div>
        <Badge tone="green">{minutesToLabel(trip.etaMin)} ETA</Badge>
      </div>
      <p className="mt-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">{trip.passengerName}</span> · {trip.pickup} → {trip.dropoff}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={trip.progress} className="flex-1" />
        <span className="text-xs font-bold text-slate-700">{trip.progress}%</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
        <span>{trip.distanceKm} km · {trip.paymentMethod}</span>
        <span>Started {timeAgo(trip.startedAt)}</span>
      </div>
    </li>
  );
}
