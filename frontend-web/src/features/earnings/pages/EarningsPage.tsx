import { useState } from 'react';
import { FiBriefcase, FiDollarSign, FiPercent } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TrendLineChart from '@/components/charts/TrendLineChart';
import ProgressBar from '@/components/ui/ProgressBar';
import PageLoader from '@/components/loading/PageLoader';
import { useCommissionSplit, useDriverEarnings, useEarnings } from '../hooks/useEarnings';
import { formatCurrency, formatNumber } from '@/utils/format';
import type { DriverEarning, RevenuePeriod } from '../types';

export default function EarningsPage() {
  const { data: revenueData, isLoading } = useEarnings();
  const { data: driverEarnings } = useDriverEarnings();
  const { data: commission } = useCommissionSplit();
  const [period, setPeriod] = useState('daily');

  const periods: Record<string, { label: string; data?: RevenuePeriod[] }> = {
    daily: { label: 'Last 7 Days', data: revenueData?.[0] },
    weekly: { label: 'Last 8 Weeks', data: revenueData?.[1] },
    monthly: { label: 'Last 6 Months', data: revenueData?.[2] },
  };

  const tabs: TabItem[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  const active = periods[period];

  const columns: Array<Column<DriverEarning>> = [
    {
      key: 'driver',
      header: 'Driver',
      cell: (row) => <span className="font-semibold text-slate-900">{row.name}</span>,
    },
    { key: 'trips', header: 'Trips', align: 'right', cell: (row) => <span className="text-slate-700">{formatNumber(row.trips)}</span> },
    { key: 'gross', header: 'Gross Earnings', align: 'right', cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.grossEarnings)}</span> },
    { key: 'commission', header: 'HatodGo Commission (20%)', align: 'right', cell: (row) => <span className="text-slate-600">{formatCurrency(row.commission)}</span> },
    { key: 'net', header: 'Net Earnings', align: 'right', cell: (row) => <span className="font-bold text-green-700">{formatCurrency(row.netEarnings)}</span> },
    {
      key: 'status',
      header: 'Payout Status',
      cell: () => <StatusBadge status="Paid" />,
    },
  ];

  return (
    <div>
      <PageHeader title="Earnings & Finance" description="Revenue, driver payouts, and company commission." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(commission?.totalRevenue ?? 0)} icon={FiDollarSign} tone="orange" delta="+7.8% vs last month" trend="up" />
        <StatCard label="Driver Payouts" value={formatCurrency(commission?.driverShare ?? 0)} icon={FiDollarSign} tone="blue" />
        <StatCard label="Company Commission" value={formatCurrency(commission?.companyCommission ?? 0)} icon={FiPercent} tone="green" delta="20% of gross" />
        <StatCard label="Platform Fees" value={formatCurrency(commission?.platformFees ?? 0)} icon={FiBriefcase} tone="indigo" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Revenue Analytics"
          subtitle={active.label}
          className="xl:col-span-2"
          bodyClassName="p-4"
          actions={
            <Tabs items={tabs} value={period} onChange={setPeriod} className="border-0" />
          }
        >
          {isLoading || !active.data ? (
            <PageLoader />
          ) : (
            <TrendLineChart
              data={active.data.map((item) => ({
                label: item.label,
                revenue: item.revenue,
                driverPayout: item.driverPayout,
                companyCommission: item.companyCommission,
              }))}
              series={[
                { name: 'Revenue', dataKey: 'revenue', color: '#F97316' },
                { name: 'Driver Payout', dataKey: 'driverPayout', color: '#3B82F6' },
                { name: 'Commission', dataKey: 'companyCommission', color: '#22C55E' },
              ]}
              height={300}
            />
          )}
        </Card>

        <Card title="Commission Split" subtitle="How every peso is distributed">
          {commission && (
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(commission.totalRevenue)}</p>
              <p className="text-xs text-slate-500">gross revenue this month</p>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Driver share</span>
                    <span className="font-bold text-slate-900">{formatCurrency(commission.driverShare)}</span>
                  </div>
                  <ProgressBar value={commission.driverSharePercent} tone="blue" />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Company commission</span>
                    <span className="font-bold text-slate-900">{formatCurrency(commission.companyCommission)}</span>
                  </div>
                  <ProgressBar value={commission.companyCommissionPercent} tone="orange" />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Platform fees (cash-out, SMS, etc.)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(commission.platformFees)}</span>
                  </div>
                  <ProgressBar value={Math.round((commission.platformFees / commission.totalRevenue) * 100)} tone="green" />
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3.5 text-xs leading-relaxed text-green-700">
                <p className="font-bold">Weekly payout summary</p>
                <p>₱1,214,600 scheduled for drivers on Friday. 99.2% of payouts completed automatically via GCash.</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Driver Earnings" subtitle="Top drivers by gross earnings this month">
          <DataTable
            columns={columns}
            data={driverEarnings ?? []}
            rowKey={(row) => row.id}
            emptyTitle="No earnings data"
            emptyDescription="Driver earnings will appear here once trips are completed."
          />
        </Card>
      </div>
    </div>
  );
}
