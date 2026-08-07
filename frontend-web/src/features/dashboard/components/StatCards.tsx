import { Link } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiCheckCircle, FiDollarSign, FiMapPin, FiUsers, FiUser, FiUserCheck, FiXCircle } from 'react-icons/fi';
import StatCard from '@/components/common/StatCard';
import Skeleton from '@/components/loading/Skeleton';
import { formatCurrency, formatNumber } from '@/utils/format';
import { useDashboardStats } from '../hooks/useDashboard';

export default function StatCards() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-28" />
            <Skeleton className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Passengers"
        value={formatNumber(stats.totalPassengers)}
        icon={FiUsers}
        tone="orange"
        delta="+8.2% this month"
        trend="up"
      />
      <StatCard
        label="Total Drivers"
        value={formatNumber(stats.totalDrivers)}
        icon={FiUser}
        tone="blue"
        delta="+4.1% this month"
        trend="up"
      />
      <StatCard
        label="Total Bookings"
        value={formatNumber(stats.totalBookings)}
        icon={FiBookOpen}
        tone="indigo"
        delta="+12.4% vs last month"
        trend="up"
      />
      <StatCard
        label="Active Trips"
        value={formatNumber(stats.activeTrips)}
        icon={FiMapPin}
        tone="cyan"
        delta="142 riders on the road"
        footer="right now"
      />
      <StatCard
        label="Completed Trips"
        value={formatNumber(stats.completedTrips)}
        icon={FiCheckCircle}
        tone="green"
        delta="94.2% completion rate"
      />
      <StatCard
        label="Cancelled Trips"
        value={formatNumber(stats.cancelledTrips)}
        icon={FiXCircle}
        tone="red"
        delta="4.0% of all bookings"
      />
      <StatCard
        label="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={FiDollarSign}
        tone="amber"
        delta="+9.6% vs last month"
        trend="up"
      />
      <StatCard
        label="Today's Revenue"
        value={formatCurrency(stats.todayRevenue)}
        icon={FiActivity}
        tone="green"
        delta="+3.2% vs yesterday"
        trend="up"
      />
      <div className="flex items-center justify-between rounded-xl border border-dashed border-primary-300 bg-primary-50/60 p-5 sm:col-span-2 xl:col-span-2">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-white">
            <FiUserCheck size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Pending Driver Applications</p>
            <p className="text-xs text-slate-500">Awaiting document review</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-extrabold text-primary-600">{stats.pendingDriverApplications}</p>
          <Link
            to="/admin/driver-verification"
            className="rounded-lg bg-primary-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-600"
          >
            Review now
          </Link>
        </div>
      </div>
    </div>
  );
}
