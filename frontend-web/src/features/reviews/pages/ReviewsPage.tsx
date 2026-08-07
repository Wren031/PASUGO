import { useMemo, useState } from 'react';
import { FiAlertTriangle, FiMessageSquare, FiStar } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';
import Badge from '@/components/ui/Badge';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useLowRatedDrivers, useModerateReview, useReviewSummary, useReviews } from '../hooks/useReviews';
import { formatDateTime } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { Review } from '../types';

export default function ReviewsPage() {
  const { data: summary } = useReviewSummary();
  const { data: reviews, isLoading } = useReviews();
  const { data: lowRated } = useLowRatedDrivers();
  const moderate = useModerateReview();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabs: TabItem[] = [
    { key: 'all', label: 'All Reviews', count: reviews?.length },
    { key: 'Passenger', label: 'Passenger Reviews', count: reviews?.filter((r) => r.type === 'Passenger').length },
    { key: 'Driver', label: 'Driver Reviews', count: reviews?.filter((r) => r.type === 'Driver').length },
    { key: 'Flagged', label: 'Flagged', count: reviews?.filter((r) => r.status === 'Flagged').length },
  ];

  const filtered = useMemo(() => {
    return (reviews ?? []).filter((review) => {
      if (tab === 'all') return true;
      if (tab === 'Flagged') return review.status === 'Flagged';
      return review.type === tab;
    });
  }, [reviews, tab]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleModerate = async (review: Review, status: 'Visible' | 'Removed') => {
    await moderate.mutateAsync({ id: review.id, status });
    toast.success(status === 'Removed' ? 'Review removed' : 'Review restored', `${review.authorName}'s review was updated.`);
  };

  const columns: Array<Column<Review>> = [
    {
      key: 'reviewer',
      header: 'Reviewer',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.authorName} size="xs" />
          <div>
            <p className="font-semibold text-slate-900">{row.authorName}</p>
            <p className="text-xs text-slate-400">about {row.targetName}</p>
          </div>
        </div>
      ),
    },
    { key: 'type', header: 'Type', cell: (row) => <Badge tone={row.type === 'Passenger' ? 'blue' : 'green'}>{row.type} review</Badge> },
    { key: 'rating', header: 'Rating', cell: (row) => <RatingStars value={row.rating} size={12} showValue /> },
    { key: 'comment', header: 'Comment', cell: (row) => <span className="block max-w-[280px] truncate text-slate-600" title={row.comment}>{row.comment}</span> },
    { key: 'booking', header: 'Booking', cell: (row) => <span className="text-xs font-semibold text-primary-600">{row.bookingId}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-slate-500">{formatDateTime(row.date)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Moderation',
      align: 'right',
      cell: (row) =>
        row.status === 'Visible' ? (
          <Button variant="ghost" size="xs" onClick={() => handleModerate(row, 'Removed')}>
            Remove
          </Button>
        ) : (
          <Button variant="outline" size="xs" onClick={() => handleModerate(row, 'Visible')}>
            Restore
          </Button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Ratings & Reviews" description="Moderate passenger and driver reviews across the platform." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average Rating" value={`${summary?.averageRating.toFixed(1) ?? '—'} / 5`} icon={FiStar} tone="amber" />
        <StatCard label="Total Reviews" value={(summary?.totalReviews ?? 0).toLocaleString()} icon={FiMessageSquare} tone="blue" />
        <StatCard label="Passenger Reviews" value={(summary?.passengerReviews ?? 0).toLocaleString()} icon={FiMessageSquare} tone="green" />
        <StatCard label="Flagged Reviews" value={(summary?.flaggedReviews ?? 0).toLocaleString()} icon={FiAlertTriangle} tone="red" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Reviews" subtitle="Latest review activity" className="xl:col-span-2" bodyClassName="p-0">
          <div className="px-5 pt-4">
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
              emptyTitle="No reviews found"
              emptyDescription="Reviews will appear here once riders rate their trips."
            />
          </div>
        </Card>

        <Card title="Low Rated Drivers" subtitle="Drivers flagged for below-target ratings">
          <ul className="divide-y divide-slate-100">
            {lowRated?.map((driver) => (
              <li key={driver.id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                <Avatar name={driver.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{driver.name}</p>
                  <p className="text-xs text-slate-500">
                    Overall {driver.rating.toFixed(1)} · recent {driver.recentRating.toFixed(1)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge tone={driver.flaggedCount >= 3 ? 'red' : 'amber'}>{driver.flaggedCount} flags</Badge>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-700">
            <p className="font-bold">Review monitoring policy</p>
            <p>Drivers with an average below 4.5 over the last 30 days are automatically flagged for coaching.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
