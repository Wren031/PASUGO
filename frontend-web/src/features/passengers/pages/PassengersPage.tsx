import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiPlus } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';
import Select from '@/components/ui/Select';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { usePassengers } from '../hooks/usePassengers';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { Passenger } from '../types';

export default function PassengersPage() {
  const navigate = useNavigate();
  const { data: passengers, isLoading } = usePassengers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (passengers ?? []).filter((passenger) => {
      const matchesSearch =
        !query ||
        passenger.name.toLowerCase().includes(query) ||
        passenger.email.toLowerCase().includes(query) ||
        passenger.phone.includes(query);
      const matchesStatus = statusFilter === 'all' || passenger.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [passengers, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Array<Column<Passenger>> = [
    {
      key: 'passenger',
      header: 'Passenger',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Mobile Number', cell: (row) => <span className="text-slate-600">{row.phone}</span> },
    {
      key: 'joinedAt',
      header: 'Joined',
      cell: (row) => <span className="text-slate-600">{formatDate(row.joinedAt)}</span>,
    },
    {
      key: 'bookings',
      header: 'Bookings',
      align: 'right',
      cell: (row) => <span className="font-semibold text-slate-800">{formatNumber(row.totalBookings)}</span>,
    },
    {
      key: 'spent',
      header: 'Total Spent',
      align: 'right',
      cell: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.totalSpent)}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (row) => <RatingStars value={row.rating} size={12} showValue />,
    },
    {
      key: 'verification',
      header: 'Identity',
      cell: (row) =>
        row.identityVerified ? (
          <Badge tone="green">Verified</Badge>
        ) : (
          <Badge tone="amber">Unverified</Badge>
        ),
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
        <Button
          variant="ghost"
          size="sm"
          icon={<FiEye size={14} />}
          onClick={() => navigate(`/admin/passengers/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Passenger Management"
        description="View, search, and manage all registered passengers."
        actions={
          <Button icon={<FiPlus size={15} />} onClick={() => toast.info('Add passenger', 'Manual passenger creation is available in the full product.')}>
            Add Passenger
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
          placeholder="Search by name, email, or mobile number…"
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
          containerClassName="sm:w-48"
          aria-label="Filter by status"
        />
        <span className="ml-auto text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span> passengers
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
        emptyTitle="No passengers found"
        emptyDescription="Try adjusting your search or filter criteria."
      />
    </div>
  );
}
