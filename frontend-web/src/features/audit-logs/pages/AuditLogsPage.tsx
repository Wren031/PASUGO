import { useState } from 'react';
import { FiActivity, FiFilter, FiShield } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/common/SearchInput';
import Select from '@/components/ui/Select';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useAuditCategories, useAuditLogs } from '../hooks/useAuditLogs';
import type { AuditCategory, AuditLog, AuditSeverity } from '../types';

const severityTone: Record<AuditSeverity, 'green' | 'amber' | 'red'> = {
  info: 'green',
  warning: 'amber',
  critical: 'red',
};

const categoryTone: Record<AuditCategory, 'orange' | 'blue' | 'green' | 'purple' | 'slate' | 'red'> = {
  Admin: 'orange',
  Booking: 'blue',
  Driver: 'green',
  Payment: 'purple',
  Account: 'slate',
  System: 'red',
};

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useAuditLogs();
  const { data: categories } = useAuditCategories();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');

  const filtered = (logs ?? []).filter((log) => {
    const matchesQuery =
      !query ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.target.toLowerCase().includes(query.toLowerCase()) ||
      log.admin.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || log.category === category;
    const matchesSeverity = severity === 'All' || log.severity === severity;
    return matchesQuery && matchesCategory && matchesSeverity;
  });

  const criticalCount = (logs ?? []).filter((log) => log.severity === 'critical').length;

  const columns: Array<Column<AuditLog>> = [
    { key: 'timestamp', header: 'Timestamp', cell: (row) => <span className="whitespace-nowrap text-sm text-slate-600">{row.timestamp}</span> },
    {
      key: 'admin',
      header: 'Admin',
      cell: (row) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">{row.admin}</p>
          <p className="text-xs text-slate-400">{row.ipAddress} · {row.device}</p>
        </div>
      ),
    },
    { key: 'action', header: 'Action', cell: (row) => <span className="text-sm font-medium text-slate-800">{row.action}</span> },
    { key: 'target', header: 'Target', cell: (row) => <span className="text-sm text-slate-600">{row.target}</span> },
    { key: 'category', header: 'Category', cell: (row) => <Badge tone={categoryTone[row.category]}>{row.category}</Badge> },
    { key: 'severity', header: 'Severity', cell: (row) => <Badge tone={severityTone[row.severity]}>{row.severity}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" description="Full trail of actions taken across the platform." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Events" value={String(logs?.length ?? 0)} icon={FiActivity} tone="orange" />
        <StatCard label="Today" value={String((logs ?? []).filter((log) => log.timestamp.startsWith('2026-08-07')).length)} icon={FiActivity} tone="blue" />
        <StatCard label="Critical Events" value={String(criticalCount)} icon={FiShield} tone="red" />
        <StatCard label="System Events" value={String((logs ?? []).filter((log) => log.admin === 'System').length)} icon={FiShield} tone="indigo" />
      </div>

      <Card title="Event Log" subtitle="Filter by category, severity, or search" bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="w-full sm:w-72">
            <SearchInput
              placeholder="Search action, target, or admin..."
              value={query}
              onChange={setQuery}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter size={14} className="text-slate-400" />
            <Select
              className="w-40"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={[{ label: 'All Categories', value: 'All' }, ...(categories ?? []).map((value) => ({ label: value, value }))]}
            />
            <Select
              className="w-36"
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              options={[
                { label: 'All Severity', value: 'All' },
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Critical', value: 'critical' },
              ]}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          loading={isLoading}
          emptyTitle="No events found"
          emptyDescription="Try adjusting the search or filters."
        />
      </Card>
    </div>
  );
}
