import { useState } from 'react';
import { FiAlertTriangle, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import DataTable, { type Column } from '@/components/tables/DataTable';
import MapPlaceholder from '@/components/common/MapPlaceholder';
import { useOperatingHours, useRestrictedAreas, useServiceAreas } from '../hooks/useServiceAreas';
import type { CityArea } from '../types';

const zoneTone: Record<string, 'blue' | 'indigo' | 'green' | 'amber'> = {
  'Metro Manila Core': 'blue',
  'Metro Manila North': 'indigo',
  'Metro Manila South': 'green',
  'Metro Manila East': 'amber',
};

export default function ServiceAreasPage() {
  const { data: cities, isLoading } = useServiceAreas();
  const { data: restricted } = useRestrictedAreas();
  const { data: hours } = useOperatingHours();
  const [selected, setSelected] = useState<CityArea | null>(null);

  const activeCities = (cities ?? []).filter((city) => city.status === 'Active').length;
  const totalDrivers = (cities ?? []).reduce((sum, city) => sum + city.activeDrivers, 0);

  const columns: Array<Column<CityArea>> = [
    {
      key: 'city',
      header: 'City',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.barangays.length} barangays covered</p>
        </div>
      ),
    },
    { key: 'zone', header: 'Coverage Zone', cell: (row) => <Badge tone={zoneTone[row.coverageZone]}>{row.coverageZone}</Badge> },
    {
      key: 'barangays',
      header: 'Barangays',
      cell: (row) => (
        <div className="flex max-w-[260px] flex-wrap gap-1">
          {row.barangays.slice(0, 3).map((barangay) => (
            <span key={barangay} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {barangay}
            </span>
          ))}
          {row.barangays.length > 3 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              +{row.barangays.length - 3}
            </span>
          )}
        </div>
      ),
    },
    { key: 'drivers', header: 'Active Drivers', align: 'right', cell: (row) => <span className="font-semibold text-slate-800">{row.activeDrivers.toLocaleString()}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) => (
        <Button variant="ghost" size="xs" onClick={() => setSelected(row)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Service Areas" description="Manage cities, barangays, coverage zones, and operating hours." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cities Covered" value={String(activeCities)} icon={FiMapPin} tone="orange" />
        <StatCard label="Barangays Served" value="48" icon={FiUsers} tone="blue" />
        <StatCard label="Active Drivers" value={totalDrivers.toLocaleString()} icon={FiUsers} tone="green" />
        <StatCard label="Restricted Areas" value={String(restricted?.length ?? 0)} icon={FiAlertTriangle} tone="red" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Cities & Coverage Zones" subtitle="Cities where HatodGo operates">
            <DataTable
              columns={columns}
              data={cities ?? []}
              rowKey={(row) => row.id}
              loading={isLoading}
              emptyTitle="No cities configured"
              emptyDescription="Service areas will appear here once configured."
            />
          </Card>

          <Card title="Operating Hours" subtitle="Default operating hours by day">
            <div className="grid gap-2 sm:grid-cols-2">
              {hours?.map((item) => (
                <div key={item.day} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.day}</p>
                    {item.surcharge && <Badge tone="amber" className="mt-1">Night surcharge applies</Badge>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{item.open}</p>
                    <p className="text-xs text-slate-400">to {item.close}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Coverage Map" subtitle="Metro Manila operations" bodyClassName="p-4">
            <MapPlaceholder pickup="NCR" dropoff="NCR+" driverLabel="" eta="" className="h-56" />
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <FiClock size={13} className="text-slate-400" />
              5:00 AM – 11:00 PM standard · 24/7 in BGC, Makati CBD, and Ortigas zones
            </p>
          </Card>

          <Card title="Restricted Areas" subtitle="Where pickups and drop-offs are limited">
            <ul className="divide-y divide-slate-100">
              {restricted?.map((area) => (
                <li key={area.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{area.name}</p>
                      <p className="text-xs text-slate-400">{area.city}</p>
                    </div>
                    <Badge tone="red">Restricted</Badge>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{area.rule}</p>
                  <p className="mt-1 text-[11px] font-medium text-amber-600">{area.schedule}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected?.coverageZone}
        size="md"
      >
        {selected && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status={selected.status} />
              <Badge tone={zoneTone[selected.coverageZone]}>{selected.coverageZone}</Badge>
            </div>
            <p className="mb-2 text-sm font-semibold text-slate-800">Barangays ({selected.barangays.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.barangays.map((barangay) => (
                <span key={barangay} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {barangay}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-600">
              <span className="font-bold text-slate-800">{selected.activeDrivers.toLocaleString()}</span> active drivers in {selected.name}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
