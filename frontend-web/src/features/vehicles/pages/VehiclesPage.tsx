import { useMemo, useState } from 'react';
import { FiTruck } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import SearchInput from '@/components/common/SearchInput';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import InfoRow from '@/components/common/InfoRow';
import Button from '@/components/ui/Button';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useVehicles, useVehicleStats } from '../hooks/useVehicles';
import { formatDate, formatNumber } from '@/utils/format';
import type { Vehicle } from '../types';

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: stats } = useVehicleStats();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (vehicles ?? []).filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.plateNumber.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.driverName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Array<Column<Vehicle>> = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.brand} {row.model}</p>
          <p className="text-xs text-slate-500">{row.plateNumber} · {row.year} · {row.color}</p>
        </div>
      ),
    },
    { key: 'driver', header: 'Assigned Driver', cell: (row) => <span className="text-slate-700">{row.driverName}</span> },
    { key: 'ownership', header: 'Ownership', cell: (row) => <Badge tone={row.ownership === 'Owner' ? 'green' : row.ownership === 'Company' ? 'blue' : 'amber'}>{row.ownership}</Badge> },
    { key: 'registration', header: 'Registration Expiry', cell: (row) => <span className="text-slate-600">{formatDate(row.registrationExpiry)}</span> },
    { key: 'insurance', header: 'Insurance Expiry', cell: (row) => <span className="text-slate-600">{formatDate(row.insuranceExpiry)}</span> },
    {
      key: 'trips',
      header: 'Trips',
      align: 'right',
      cell: (row) => <span className="font-semibold text-slate-800">{formatNumber(row.tripsCount)}</span>,
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Vehicle Management" description="Motorcycle registration, insurance, and compliance." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Vehicles" value={formatNumber(stats?.total ?? 0)} icon={FiTruck} tone="orange" />
        <StatCard label="Active Vehicles" value={formatNumber(stats?.active ?? 0)} icon={FiTruck} tone="green" />
        <StatCard label="Expiring Soon" value={formatNumber(stats?.expiringSoon ?? 0)} icon={FiTruck} tone="red" />
        <StatCard label="Under Review" value={formatNumber(stats?.underReview ?? 0)} icon={FiTruck} tone="amber" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by plate, model, or driver…"
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
            { value: 'Expired', label: 'Expired' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          containerClassName="sm:w-48"
          aria-label="Filter by vehicle status"
        />
        <span className="ml-auto text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span> vehicles
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
        onRowClick={setSelected}
        emptyTitle="No vehicles found"
        emptyDescription="Try adjusting your search or filter criteria."
      />

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.brand} ${selected.model}` : ''}
        subtitle={selected?.plateNumber}
        size="md"
      >
        {selected && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <Badge tone={selected.status === 'Active' ? 'green' : selected.status === 'Expired' ? 'red' : selected.status === 'Under Review' ? 'amber' : 'slate'}>
                {selected.status}
              </Badge>
              <Badge tone={selected.ownership === 'Owner' ? 'green' : selected.ownership === 'Company' ? 'blue' : 'amber'}>
                {selected.ownership}
              </Badge>
            </div>
            <InfoRow label="Assigned Driver" value={selected.driverName} />
            <InfoRow label="Model" value={`${selected.brand} ${selected.model} (${selected.year})`} />
            <InfoRow label="Color" value={selected.color} />
            <InfoRow label="Total Trips" value={formatNumber(selected.tripsCount)} />
            <div className="my-3 border-t border-slate-100" />
            <InfoRow label="Registration Expiry" value={formatDate(selected.registrationExpiry)} />
            <InfoRow label="Insurance Expiry" value={formatDate(selected.insuranceExpiry)} />
            <InfoRow label="Last Inspection" value={formatDate(selected.lastInspection)} />
            <div className="mt-4">
              <Button variant="outline" size="sm" full onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
