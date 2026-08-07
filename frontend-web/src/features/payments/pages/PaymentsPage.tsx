import { useMemo, useState } from 'react';
import { FiAlertTriangle, FiCreditCard, FiDollarSign, FiRepeat } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/tables/DataTable';
import StatusDonutChart from '@/components/charts/StatusDonutChart';
import { usePaymentStats, useRefundRequests, useTransactions } from '../hooks/usePayments';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { CHART_COLORS } from '@/constants/app';
import type { RefundRequest, Transaction, TransactionStatus } from '../types';

const methodTone: Record<string, 'green' | 'blue' | 'indigo' | 'amber'> = {
  Cash: 'green',
  GCash: 'blue',
  Card: 'indigo',
  Wallet: 'amber',
};

export default function PaymentsPage() {
  const { data: stats } = usePaymentStats();
  const { data: transactions, isLoading } = useTransactions();
  const { data: refunds } = useRefundRequests();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabs: TabItem[] = [
    { key: 'all', label: 'All Transactions', count: transactions?.length },
    { key: 'Cash', label: 'Cash' },
    { key: 'GCash', label: 'GCash' },
    { key: 'Card', label: 'Card' },
    { key: 'Wallet', label: 'Wallet' },
  ];

  const filtered = useMemo(() => {
    return (transactions ?? []).filter((item) => tab === 'all' || item.method === tab);
  }, [transactions, tab]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Array<Column<Transaction>> = [
    { key: 'reference', header: 'Reference', cell: (row) => <span className="font-semibold text-primary-600">{row.reference}</span> },
    { key: 'booking', header: 'Booking', cell: (row) => <span className="text-slate-600">{row.bookingId}</span> },
    { key: 'type', header: 'Type', cell: (row) => <Badge tone={row.type === 'Payment' ? 'green' : row.type === 'Refund' ? 'indigo' : 'blue'}>{row.type}</Badge> },
    {
      key: 'passenger',
      header: 'Passenger',
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.passengerName}</p>
          {row.driverName && <p className="text-xs text-slate-400">via {row.driverName}</p>}
        </div>
      ),
    },
    { key: 'method', header: 'Method', cell: (row) => <Badge tone={methodTone[row.method]}>{row.method}</Badge> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-slate-500">{formatDateTime(row.date)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const refundColumns: Array<Column<RefundRequest>> = [
    { key: 'reference', header: 'Reference', cell: (row) => <span className="font-semibold text-primary-600">{row.reference}</span> },
    { key: 'booking', header: 'Booking', cell: (row) => <span className="text-slate-600">{row.bookingId}</span> },
    { key: 'passenger', header: 'Passenger', cell: (row) => <span className="text-slate-700">{row.passengerName}</span> },
    { key: 'reason', header: 'Reason', cell: (row) => <span className="max-w-[220px] truncate text-slate-600">{row.reason}</span> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span> },
    { key: 'date', header: 'Requested', cell: (row) => <span className="text-xs text-slate-500">{formatDateTime(row.requestedAt)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Payment Management"
        description="Cash, GCash, card, and wallet transactions across the platform."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cash Volume" value={formatCurrency(stats?.cashVolume ?? 0)} icon={FiDollarSign} tone="green" />
        <StatCard label="GCash Volume" value={formatCurrency(stats?.gcashVolume ?? 0)} icon={FiCreditCard} tone="blue" />
        <StatCard label="Card Volume" value={formatCurrency(stats?.cardVolume ?? 0)} icon={FiCreditCard} tone="indigo" />
        <StatCard label="Wallet Volume" value={formatCurrency(stats?.walletVolume ?? 0)} icon={FiRepeat} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Payment Method Mix" subtitle="Share of total volume by channel">
          <StatusDonutChart
            data={[
              { name: 'Cash', value: 40.5, color: CHART_COLORS.green },
              { name: 'GCash', value: 35.3, color: CHART_COLORS.blue },
              { name: 'Card', value: 14.7, color: CHART_COLORS.indigo },
              { name: 'Wallet', value: 9.5, color: CHART_COLORS.amber },
            ]}
            centerValue="₱8.45M"
            centerLabel="total volume"
            height={200}
          />
          <ul className="mt-2 space-y-1.5 text-xs">
            {[
              { name: 'Cash', value: '₱3.42M', color: CHART_COLORS.green },
              { name: 'GCash', value: '₱2.98M', color: CHART_COLORS.blue },
              { name: 'Card', value: '₱1.24M', color: CHART_COLORS.indigo },
              { name: 'Wallet', value: '₱0.81M', color: CHART_COLORS.amber },
            ].map((entry) => (
              <li key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-slate-700">{entry.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
              <FiAlertTriangle size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Refund Requests</p>
              <p className="text-2xl font-extrabold text-amber-600">{stats?.refundRequests ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-white">
              <FiAlertTriangle size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Failed Transactions</p>
              <p className="text-2xl font-extrabold text-red-600">{stats?.failedTransactions ?? 0}</p>
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-700">
              <p className="font-bold">Failed transaction insight</p>
              <p>68% of failed transactions are card declines (insufficient funds or expired cards). GCash failures dropped 22% after the June gateway upgrade.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Card title="Transactions" subtitle="All payment activity" bodyClassName="p-0">
          <div className="px-5 pt-2">
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
              emptyTitle="No transactions found"
              emptyDescription="Transactions will appear here as bookings are completed."
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Refund Requests" subtitle="Open refund and dispute cases">
          <DataTable
            columns={refundColumns}
            data={refunds ?? []}
            rowKey={(row) => row.id}
            emptyTitle="No refund requests"
            emptyDescription="Refund requests from passengers will appear here."
          />
        </Card>
      </div>
    </div>
  );
}
