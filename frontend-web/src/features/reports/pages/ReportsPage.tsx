import { useState } from 'react';
import { FiBarChart2, FiClock, FiDownload, FiMapPin, FiTrendingUp, FiUsers, FiXCircle } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import RevenueAreaChart from '@/components/charts/RevenueAreaChart';
import ProgressBar from '@/components/ui/ProgressBar';
import { useExportReport, useReport } from '../hooks/useReports';
import type { ReportTimeframe } from '../types';
import { formatCurrency, formatNumber } from '@/utils/format';
import { toast } from '@/app/store/toast-store';

const timeframes: Array<{ label: string; value: ReportTimeframe }> = [
  { label: 'Today', value: 'daily' },
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' },
];

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('weekly');
  const { data, isLoading } = useReport(timeframe);
  const exportMutation = useExportReport();

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const result = await exportMutation.mutateAsync({ timeframe, format });
      toast.success('Report exported', `${result.file} (${result.size}) is ready to download.`);
    } catch {
      toast.error('Export failed', 'Unable to generate the report right now.');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  const summary = data.summary;
  const maxRouteTrips = data.popularRoutes[0]?.trips ?? 1;
  const maxCancellation = data.cancellationReasons[0]?.count ?? 1;

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Track bookings, revenue, and operational performance."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" loading={exportMutation.isPending} onClick={() => handleExport('pdf')}>
              <FiDownload size={14} /> PDF
            </Button>
            <Button variant="outline" size="sm" loading={exportMutation.isPending} onClick={() => handleExport('excel')}>
              <FiDownload size={14} /> Excel
            </Button>
            <Button variant="outline" size="sm" loading={exportMutation.isPending} onClick={() => handleExport('csv')}>
              <FiDownload size={14} /> CSV
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex items-center justify-between">
        <Tabs
          items={timeframes.map((item) => ({ key: item.value, label: item.label }))}
          value={timeframe}
          onChange={(value) => setTimeframe(value as ReportTimeframe)}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={formatNumber(summary.bookings)} icon={FiTrendingUp} tone="orange" />
        <StatCard label="Total Revenue" value={formatCurrency(summary.revenue)} icon={FiBarChart2} tone="green" />
        <StatCard label="Active Drivers" value={formatNumber(summary.activeDrivers)} icon={FiUsers} tone="blue" />
        <StatCard label="New Passengers" value={formatNumber(summary.newPassengers)} icon={FiUsers} tone="indigo" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Bookings & Revenue Trend" subtitle="Rolling 7-week overview">
            <RevenueAreaChart data={data.bookingTrend.map((trend) => ({ label: trend.week, revenue: trend.revenue }))} />
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Peak Hours" subtitle="Bookings by hour">
              <ul className="space-y-2.5">
                {data.peakHours.map((peak) => (
                  <li key={peak.hour} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs font-medium text-slate-500">{peak.hour}</span>
                    <ProgressBar value={peak.bookings} max={156} tone="orange" />
                    <span className="w-8 shrink-0 text-right text-xs font-bold text-slate-700">{peak.bookings}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <FiClock size={13} className="text-slate-400" /> Rush hours: 8 AM and 6 PM
              </p>
            </Card>

            <Card title="Cancellation Reasons" subtitle="Why bookings fall through">
              <ul className="space-y-2.5">
                {data.cancellationReasons.map((reason) => (
                  <li key={reason.reason}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{reason.reason}</span>
                      <span className="text-slate-500">{reason.percentage}%</span>
                    </div>
                    <ProgressBar value={reason.count} max={maxCancellation} tone="red" />
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <FiXCircle size={13} className="text-slate-400" /> {summary.cancellations} cancellations this period
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card title="Popular Routes" subtitle="Top corridors this period">
            <ul className="divide-y divide-slate-100">
              {data.popularRoutes.map((route, index) => (
                <li key={route.route} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{route.route}</p>
                    <p className="text-xs text-slate-400">{route.distanceKm} km avg · {formatNumber(route.trips)} trips</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-slate-900">{formatCurrency(route.revenue)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Performance Summary" subtitle="Operational metrics">
            <ul className="divide-y divide-slate-100">
              <SummaryRow label="Avg ride duration" value={`${summary.avgRideDuration} min`} />
              <SummaryRow label="Average rating" value={`${summary.avgRating} ★`} />
              <SummaryRow label="Completed trips" value={formatNumber(summary.completedTrips)} />
              <SummaryRow label="Total distance" value={`${formatNumber(summary.distanceKm)} km`} />
              <SummaryRow label="Cancellation rate" value={`${((summary.cancellations / summary.bookings) * 100).toFixed(1)}%`} />
              <SummaryRow label="Revenue / trip" value={formatCurrency(Math.round(summary.revenue / summary.bookings))} />
            </ul>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <FiMapPin size={13} className="text-slate-400" /> Data refreshed 2 minutes ago
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </li>
  );
}
