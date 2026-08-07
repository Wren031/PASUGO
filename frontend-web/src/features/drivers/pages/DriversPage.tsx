import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiUserPlus } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/ui/RatingStars';
import Select from '@/components/ui/Select';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useDrivers } from '../hooks/useDrivers';
import { formatCurrency, formatNumber } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { Driver } from '../types';
import { cn } from '@/lib/utils';

const availabilityDot: Record<string, string> = {
  Online: 'bg-green-500',
  'On Trip': 'bg-primary-500',
  Offline: 'bg-slate-300',
};

export default function DriversPage() {
  const navigate = useNavigate();
  const { data: drivers, isLoading } = useDrivers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (drivers ?? []).filter((driver) => {
      const matchesSearch =
        !query ||
        driver.name.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.plateNumber.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
      const matchesAvailability = availabilityFilter === 'all' || driver.availability === availabilityFilter;
      return matchesSearch && matchesStatus && matchesAvailability;
    });
  }, [drivers, search, statusFilter, availabilityFilter]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Array<Column<Driver>> = [
    {
      key: 'driver',
      header: 'Driver',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name={row.name} size="sm" />
            <span className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white', availabilityDot[row.availability])} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.motorcycle} · {row.plateNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (row) => <RatingStars value={row.rating} size={12} showValue />,
    },
    {
      key: 'trips',
      header: 'Total Trips',
      align: 'right',
      cell: (row) => <span className="font-semibold text-slate-800">{formatNumber(row.totalTrips)}</span>,
    },
    {
      key: 'earnings',
      header: 'Total Earnings',
      align: 'right',
      cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.totalEarnings)}</span>,
    },
    {
      key: 'availability',
      header: 'Availability',
      cell: (row) => <StatusBadge status={row.availability} />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) => (
        <Button variant="ghost" size="sm" icon={<FiEye size={14} />} onClick={() => navigate(`/admin/drivers/${row.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Driver Management"
        description="View, rate, and manage all registered drivers."
        actions={
          <Button
            icon={<FiUserPlus size={15} />}
            onClick={() => toast.info('Invite driver', 'Driver invitations are sent from the Driver Verification module.')}
          >
            Invite Driver
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by name, email, or plate number…"
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
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Suspended', label: 'Suspended' },
          ]}
          containerClassName="sm:w-40"
          aria-label="Filter by account status"
        />
        <Select
          value={availabilityFilter}
          onChange={(event) => {
            setAvailabilityFilter(event.target.value);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All availability' },
            { value: 'Online', label: 'Online' },
            { value: 'On Trip', label: 'On Trip' },
            { value: 'Offline', label: 'Offline' },
          ]}
          containerClassName="sm:w-44"
          aria-label="Filter by availability"
        />
        <span className="ml-auto text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span> drivers
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
        emptyTitle="No drivers found"
        emptyDescription="Try adjusting your search or filter criteria."
      />
    </div>
  );
}
