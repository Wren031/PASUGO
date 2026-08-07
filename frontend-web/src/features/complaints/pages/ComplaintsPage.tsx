import { useMemo, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useComplaintStats, useComplaints, useResolveComplaint, useSupportTickets } from '../hooks/useComplaints';
import { formatDateTime, timeAgo } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { Complaint } from '../types';

const priorityTone: Record<string, 'red' | 'amber' | 'slate'> = {
  High: 'red',
  Medium: 'amber',
  Low: 'slate',
};

const categoryTone: Record<string, 'red' | 'amber' | 'blue' | 'indigo' | 'slate'> = {
  Payment: 'red',
  Trip: 'amber',
  Behavior: 'blue',
  Vehicle: 'indigo',
  Other: 'slate',
};

export default function ComplaintsPage() {
  const { data: stats } = useComplaintStats();
  const { data: complaints, isLoading } = useComplaints();
  const { data: tickets } = useSupportTickets();
  const resolveMutation = useResolveComplaint();
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabs: TabItem[] = [
    { key: 'all', label: 'All Complaints', count: complaints?.length },
    { key: 'Passenger', label: 'Passenger Complaints', count: complaints?.filter((c) => c.type === 'Passenger').length },
    { key: 'Driver', label: 'Driver Complaints', count: complaints?.filter((c) => c.type === 'Driver').length },
    { key: 'Open', label: 'Open', count: complaints?.filter((c) => c.status === 'Open').length },
  ];

  const filtered = useMemo(() => {
    return (complaints ?? []).filter((complaint) => {
      if (tab === 'all') return true;
      if (tab === 'Open') return complaint.status === 'Open';
      return complaint.type === tab;
    });
  }, [complaints, tab]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleResolve = async () => {
    if (!selected) return;
    try {
      await resolveMutation.mutateAsync({ id: selected.id, resolution: resolution.trim() || 'Complaint reviewed and resolved.' });
      toast.success('Complaint resolved', `${selected.id} has been marked as resolved.`);
      setSelected(null);
      setResolution('');
    } catch {
      toast.error('Action failed', 'Unable to resolve the complaint.');
    }
  };

  const columns: Array<Column<Complaint>> = [
    { key: 'id', header: 'ID', cell: (row) => <span className="font-semibold text-primary-600">{row.id}</span> },
    { key: 'type', header: 'Type', cell: (row) => <Badge tone={row.type === 'Passenger' ? 'blue' : 'green'}>{row.type}</Badge> },
    { key: 'category', header: 'Category', cell: (row) => <Badge tone={categoryTone[row.category]}>{row.category}</Badge> },
    {
      key: 'subject',
      header: 'Subject',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.subject}</p>
          <p className="text-xs text-slate-500">{row.submittedBy} → {row.against}</p>
        </div>
      ),
    },
    { key: 'priority', header: 'Priority', cell: (row) => <Badge tone={priorityTone[row.priority]}>{row.priority}</Badge> },
    { key: 'submittedAt', header: 'Submitted', cell: (row) => <span className="text-xs text-slate-500">{timeAgo(row.submittedAt)}</span> },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) =>
        row.status === 'Resolved' || row.status === 'Closed' ? (
          <Button variant="ghost" size="xs" onClick={() => setSelected(row)}>
            View
          </Button>
        ) : (
          <Button variant="outline" size="xs" onClick={() => { setSelected(row); setResolution(''); }}>
            Resolve
          </Button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Complaints & Support" description="Manage complaints, disputes, and support tickets." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Complaints" value={String(stats?.open ?? 0)} icon={FiAlertCircle} tone="red" />
        <StatCard label="Under Review" value={String(stats?.underReview ?? 0)} icon={FiClock} tone="amber" />
        <StatCard label="Resolved" value={String(stats?.resolved ?? 0)} icon={FiCheckCircle} tone="green" />
        <StatCard label="Avg. Resolution Time" value={`${stats?.avgResolutionHours ?? 0}h`} icon={FiClock} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Complaints" subtitle="Passenger and driver complaints" className="xl:col-span-2" bodyClassName="p-0">
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
              emptyTitle="No complaints found"
              emptyDescription="Complaints submitted by passengers and drivers will appear here."
            />
          </div>
        </Card>

        <Card title="Support Tickets" subtitle="Latest customer support requests">
          <ul className="divide-y divide-slate-100">
            {tickets?.map((ticket) => (
              <li key={ticket.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar name={ticket.requester} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{ticket.subject}</p>
                  <p className="text-xs text-slate-500">
                    {ticket.id} · {ticket.channel} · {ticket.assignedTo}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-500">
            Tickets are auto-routed to the Customer Support team and escalate after 24 hours without response.
          </div>
        </Card>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `Complaint ${selected.id}` : ''}
        subtitle={selected ? `${selected.category} · submitted ${formatDateTime(selected.submittedAt)}` : undefined}
        size="lg"
      >
        {selected && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone={selected.type === 'Passenger' ? 'blue' : 'green'}>{selected.type} complaint</Badge>
              <Badge tone={priorityTone[selected.priority]}>{selected.priority} priority</Badge>
              <StatusBadge status={selected.status} />
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-bold text-slate-900">{selected.subject}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <p className="text-slate-400">Submitted by</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{selected.submittedBy}</p>
                </div>
                <div>
                  <p className="text-slate-400">Against</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{selected.against}</p>
                </div>
                <div>
                  <p className="text-slate-400">Booking</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{selected.bookingId ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Submitted at</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{formatDateTime(selected.submittedAt)}</p>
                </div>
              </div>
              {selected.resolution && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-xs leading-relaxed text-green-700">
                  <p className="font-bold">Resolution ({selected.resolvedAt ? timeAgo(selected.resolvedAt) : ''})</p>
                  <p className="mt-1">{selected.resolution}</p>
                </div>
              )}
            </div>
            {selected.status !== 'Resolved' && selected.status !== 'Closed' && (
              <div className="mt-5">
                <Textarea
                  label="Resolution notes"
                  placeholder="Describe how this complaint was resolved…"
                  value={resolution}
                  onChange={(event) => setResolution(event.target.value)}
                  rows={3}
                />
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                  <Button onClick={handleResolve} loading={resolveMutation.isPending}>
                    Resolve Complaint
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
