import { FiGift, FiPercent, FiTag, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { usePromoCampaigns, usePromoCodes, usePromoStats } from '../hooks/usePromotions';
import { formatCurrency, formatDate } from '@/utils/format';
import type { PromoCampaign, PromoCode } from '../types';

const typeTone: Record<string, 'indigo' | 'green' | 'blue'> = {
  Discount: 'indigo',
  Referral: 'green',
  'First Ride': 'blue',
};

export default function PromotionsPage() {
  const { data: stats } = usePromoStats();
  const { data: codes, isLoading } = usePromoCodes();
  const { data: campaigns } = usePromoCampaigns();

  const codeColumns: Array<Column<PromoCode>> = [
    {
      key: 'code',
      header: 'Promo Code',
      cell: (row) => (
        <div>
          <span className="rounded-lg border border-dashed border-primary-300 bg-primary-50 px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-primary-700">
            {row.code}
          </span>
          <p className="mt-1.5 text-xs text-slate-500">{row.description}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type', cell: (row) => <Badge tone={typeTone[row.type]}>{row.type}</Badge> },
    { key: 'value', header: 'Value', cell: (row) => <span className="font-semibold text-slate-800">{row.valueLabel}</span> },
    {
      key: 'usage',
      header: 'Usage',
      cell: (row) => (
        <div className="w-32">
          <ProgressBar value={row.usageCount} max={row.usageCap} label={`${row.usageCount.toLocaleString()} / ${row.usageCap.toLocaleString()}`} />
        </div>
      ),
    },
    { key: 'min', header: 'Min. Spend', align: 'right', cell: (row) => <span className="text-slate-600">{row.minSpend ? formatCurrency(row.minSpend) : '—'}</span> },
    { key: 'max', header: 'Max. Discount', align: 'right', cell: (row) => <span className="text-slate-600">{formatCurrency(row.maxDiscount)}</span> },
    {
      key: 'validity',
      header: 'Validity',
      cell: (row) => (
        <div className="text-xs text-slate-500">
          <p>{formatDate(row.startsAt)}</p>
          <p>→ {formatDate(row.endsAt)}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const campaignColumns: Array<Column<PromoCampaign>> = [
    { key: 'name', header: 'Campaign', cell: (row) => <span className="font-semibold text-slate-900">{row.name}</span> },
    { key: 'type', header: 'Type', cell: (row) => <Badge tone={typeTone[row.type]}>{row.type}</Badge> },
    {
      key: 'budget',
      header: 'Budget',
      align: 'right',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{formatCurrency(row.spent)}</p>
          <p className="text-xs text-slate-400">of {formatCurrency(row.budget)}</p>
        </div>
      ),
    },
    { key: 'redemptions', header: 'Redemptions', align: 'right', cell: (row) => <span className="text-slate-700">{row.redemptions.toLocaleString()}</span> },
    { key: 'conversion', header: 'Conversion Rate', align: 'right', cell: (row) => <span className="font-semibold text-primary-600">{row.conversionRate.toFixed(1)}%</span> },
    { key: 'ends', header: 'Ends', cell: (row) => <span className="text-xs text-slate-500">{formatDate(row.endsAt)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Promotions" description="Promo codes, referral rewards, and discount campaigns." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Promo Codes" value={String(stats?.activeCodes ?? 0)} icon={FiTag} tone="orange" />
        <StatCard label="Total Redemptions" value={(stats?.totalRedemptions ?? 0).toLocaleString()} icon={FiGift} tone="blue" />
        <StatCard label="Revenue Impact" value={formatCurrency(stats?.revenueImpact ?? 0)} icon={FiTrendingUp} tone="green" />
        <StatCard label="Avg. Redemption Rate" value={`${stats?.avgRedemptionRate ?? 0}%`} icon={FiPercent} tone="indigo" />
      </div>

      <Card title="Promo Codes" subtitle="Active and historical promo codes" className="mb-6" bodyClassName="p-5">
        <DataTable
          columns={codeColumns}
          data={codes ?? []}
          rowKey={(row) => row.id}
          loading={isLoading}
          emptyTitle="No promo codes"
          emptyDescription="Promo codes you create will appear here."
        />
      </Card>

      <Card title="Discount Campaigns" subtitle="Campaign performance and spend">
        <DataTable
          columns={campaignColumns}
          data={campaigns ?? []}
          rowKey={(row) => row.id}
          emptyTitle="No campaigns"
          emptyDescription="Marketing campaigns will appear here."
        />
      </Card>
    </div>
  );
}
