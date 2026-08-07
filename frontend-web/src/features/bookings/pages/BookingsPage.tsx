import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useBookings } from '../hooks/useBookings';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Booking } from '../types';

const activeStatuses = ['Pending', 'Searching Driver', 'Accepted', 'Driver Arrived', 'In Progress'];

export default function BookingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: bookings, isLoading } = useBookings();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const view = searchParams.get('view') === 'history' ? 'history' : 'active';

  const tabs: TabItem[] = [
    { key: 'active', label: 'Active Bookings', count: (bookings ?? []).filter((b) => activeStatuses.includes(b.status)).length },
    { key: 'history', label: 'Booking History', count: (bookings ?? []).filter((b) => !activeStatuses.includes(b.status)).length },
  ];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (bookings ?? []).filter((booking) => {
      const inView = view === 'active' ? activeStatuses.includes(booking.status) : !activeStatuses.includes(booking.status);
      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.passengerName.toLowerCase().includes(query) ||
        booking.driverName?.toLowerCase().includes(query) ||
        booking.pickup.toLowerCase().includes(query) ||
        booking.dropoff.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return inView && matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter, view]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Array<Column<Booking>> = [
    { key: 'id', header: 'Booking ID', cell: (row) => <span className="font-semibold text-primary-600">{row.id}</span> },
    {
      key: 'passenger',
      header: 'Passenger',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.passengerName} size="xs" />
          <span className="font-medium text-slate-800">{row.passengerName}</span>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      cell: (row) => (
        <div>
          <p className="text-slate-700">{row.pickup}</p>
          <p className="text-xs text-slate-400">→ {row.dropoff}</p>
        </div>
      ),
    },
    { key: 'driver', header: 'Driver', cell: (row) => <span className="text-slate-600">{row.driverName ?? '—'}</span> },
    { key: 'bookedAt', header: 'Booked At', cell: (row) => <span className="text-xs text-slate-500">{formatDateTime(row.bookedAt)}</span> },
    { key: 'fare', header: 'Fare', align: 'right', cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.fare.total)}</span> },
    { key: 'payment', header: 'Payment', cell: (row) => <span className="text-slate-600">{row.paymentMethod}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) => (
        <Button variant="ghost" size="sm" icon={<FiEye size={14} />} onClick={() => navigate(`/admin/bookings/${row.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Booking Management"
        description="Track active bookings and review booking history."
      />

      <Tabs
        items={tabs}
        value={view}
        onChange={(key) => {
          setSearchParams({ view: key });
          setPage(1);
        }}
        className="mb-5"
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by ID, passenger, driver, or route…"
          className="sm:max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Searching Driver', label: 'Searching Driver' },
            { value: 'Accepted', label: 'Accepted' },
            { value: 'Driver Arrived', label: 'Driver Arrived' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
          containerClassName="sm:w-48"
          aria-label="Filter by booking status"
        />
        <span className="ml-auto text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span> bookings
        </span>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        rowKey={(row) => row.id}
        loading={isLoading}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        emptyTitle={`No ${view === 'active' ? 'active' : 'historical'} bookings found`}
        emptyDescription="Try adjusting your search or filter criteria."
      />

      {view === 'active' && !isLoading && filtered.length > 0 && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-700">
          <p className="font-bold">Live updates enabled</p>
          <p>This list refreshes automatically every 15 seconds to reflect real-time booking activity.</p>
        </div>
      )}
    </div>
  );
}
