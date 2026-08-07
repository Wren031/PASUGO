import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiUsers, FiBookOpen, FiMapPin, FiAward } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCards from '../components/StatCards';
import RevenueAreaChart from '@/components/charts/RevenueAreaChart';
import BookingsBarChart from '@/components/charts/BookingsBarChart';
import StatusDonutChart from '@/components/charts/StatusDonutChart';
import RecentActivities, { ActivitySkeleton } from '../components/RecentActivities';
import { LiveDriverList, LatestBookingList, TopDriverList, ViewAllLink } from '../components/DashboardLists';
import { useBookingAnalytics, useLatestBookings, useLiveDrivers, useRecentActivities, useRevenueTrend, useTopDrivers } from '../hooks/useDashboard';
import { CHART_COLORS } from '@/constants/app';
import { formatCurrency } from '@/utils/format';
import PageLoader from '@/components/loading/PageLoader';
import EmptyState from '@/components/common/EmptyState';

export default function DashboardPage() {
  const bookingAnalytics = useBookingAnalytics();
  const revenueTrend = useRevenueTrend();
  const recentActivities = useRecentActivities();
  const liveDrivers = useLiveDrivers();
  const topDrivers = useTopDrivers();
  const latestBookings = useLatestBookings();

  const bookingStatusData = useMemo(
    () => [
      { name: 'Pending', value: 1240, color: CHART_COLORS.amber },
      { name: 'Searching', value: 386, color: CHART_COLORS.blue },
      { name: 'In Progress', value: 142, color: CHART_COLORS.indigo },
      { name: 'Completed', value: 121380, color: CHART_COLORS.orange },
      { name: 'Cancelled', value: 5104, color: CHART_COLORS.red },
    ],
    [],
  );

  const totalThisWeek = useMemo(() => (revenueTrend.data ?? []).reduce((sum, day) => sum + day.revenue, 0), [revenueTrend.data]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your ride-booking platform."
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

      <StatCards />

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Booking Analytics"
          subtitle="Completed vs cancelled bookings this week"
          className="xl:col-span-2"
          bodyClassName="p-4"
        >
          {bookingAnalytics.isLoading ? (
            <PageLoader />
          ) : (
            <BookingsBarChart data={bookingAnalytics.data ?? []} />
          )}
        </Card>
        <Card title="Booking Status" subtitle="Distribution across all bookings">
          <StatusDonutChart data={bookingStatusData} centerValue="128.9k" centerLabel="total bookings" />
          <ul className="mt-2 space-y-1.5">
            {bookingStatusData.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-slate-700">{entry.value.toLocaleString('en-PH')}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Revenue Trend"
          subtitle="Last 7 days · all payment channels"
          actions={
            <span className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
              {formatCurrency(totalThisWeek)} this week
            </span>
          }
          className="xl:col-span-2"
          bodyClassName="p-4"
        >
          {revenueTrend.isLoading ? (
            <PageLoader />
          ) : (
            <RevenueAreaChart data={revenueTrend.data ?? []} />
          )}
        </Card>
        <Card
          title="Recent Activities"
          subtitle="Latest events across the platform"
          actions={<ViewAllLink to="/admin/audit-logs" label="View audit logs" />}
        >
          {recentActivities.isLoading ? <ActivitySkeleton /> : <RecentActivities items={recentActivities.data ?? []} />}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Live Driver Status"
          subtitle="Driver availability right now"
          actions={
            <span className="text-xs text-slate-400">
              {(liveDrivers.data ?? []).filter((d) => d.status !== 'Offline').length} online
            </span>
          }
        >
          {liveDrivers.isLoading ? <ActivitySkeleton /> : <LiveDriverList drivers={liveDrivers.data ?? []} />}
        </Card>
        <Card
          title="Top Drivers"
          subtitle="Highest earners this month"
          actions={<ViewAllLink to="/admin/drivers" label="All drivers" />}
        >
          {topDrivers.isLoading ? <ActivitySkeleton /> : <TopDriverList drivers={topDrivers.data ?? []} />}
        </Card>
        <Card
          title="Latest Bookings"
          subtitle="Most recent booking activity"
          actions={<ViewAllLink to="/admin/bookings" label="All bookings" />}
        >
          {latestBookings.isLoading ? (
            <ActivitySkeleton />
          ) : (
            <LatestBookingList bookings={latestBookings.data ?? []} />
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <Link
          to="/admin/passengers"
          className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <FiUsers size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Manage Passengers</p>
            <p className="text-xs text-slate-500">Profiles, verification & suspensions</p>
          </div>
        </Link>
        <Link
          to="/admin/live-trips"
          className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiMapPin size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Live Trip Monitoring</p>
            <p className="text-xs text-slate-500">Track active rides in real time</p>
          </div>
        </Link>
        <Link
          to="/admin/reports"
          className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <FiAward size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Reports & Analytics</p>
            <p className="text-xs text-slate-500">Export bookings, revenue & more</p>
          </div>
        </Link>
      </div>

      <div className="mt-6">
        <Card title="System Status" subtitle="Platform health and alerts">
          <EmptyState
            icon={FiAlertCircle}
            title="All systems operational"
            description="No critical alerts. All platform services are running normally."
          />
        </Card>
      </div>
    </div>
  );
}
