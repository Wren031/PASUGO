import { useMemo, useState } from 'react';
import { FiCamera, FiEye, FiFileText } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Tabs from '@/components/ui/Tabs';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import DocumentPreview from '../components/DocumentPreview';
import { useApplications, useApplicationMutation } from '../hooks/useVerification';
import { formatDate, timeAgo } from '@/utils/format';
import { toast } from '@/app/store/toast-store';
import type { DriverApplication, VerificationDocument } from '../types';
import { cn } from '@/lib/utils';

type ReviewAction = 'approve' | 'reject' | 'resubmit' | null;

const docTone: Record<VerificationDocument['status'], 'green' | 'amber' | 'red' | 'blue'> = {
  Approved: 'green',
  Pending: 'amber',
  Rejected: 'red',
  Resubmission: 'blue',
};

export default function DriverVerificationPage() {
  const { data: applications, isLoading } = useApplications();
  const mutation = useApplicationMutation();
  const [tab, setTab] = useState('Pending');
  const [selected, setSelected] = useState<DriverApplication | null>(null);
  const [action, setAction] = useState<ReviewAction>(null);
  const [note, setNote] = useState('');

  const counts = useMemo(() => {
    const map: Record<string, number> = { Pending: 0, Approved: 0, Rejected: 0, Resubmission: 0 };
    (applications ?? []).forEach((app) => {
      map[app.status] = (map[app.status] ?? 0) + 1;
    });
    return map;
  }, [applications]);

  const filtered = (applications ?? []).filter((app) => app.status === tab);

  const openReview = (application: DriverApplication) => {
    setSelected(application);
    setAction(null);
    setNote('');
  };

  const runAction = async (actionType: Exclude<ReviewAction, null>) => {
    if (!selected) return;
    try {
      await mutation.mutateAsync({ id: selected.id, action: actionType, note: note.trim() || undefined });
      if (actionType === 'approve') {
        toast.success('Application approved', `${selected.name} is now an approved driver.`);
      } else if (actionType === 'reject') {
        toast.error('Application rejected', `${selected.name} was notified of the decision.`);
      } else {
        toast.info('Resubmission requested', `${selected.name} was asked to resubmit documents.`);
      }
      setSelected(null);
    } catch {
      toast.error('Action failed', 'Unable to update the application.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Driver Verification"
        description="Review license, OR/CR, NBI clearance, and vehicle photos for pending applications."
        badge={<StatusBadge status={`${counts.Pending ?? 0} pending`} />}
      />

      <Tabs
        items={[
          { key: 'Pending', label: 'Pending', count: counts.Pending },
          { key: 'Resubmission', label: 'Resubmission', count: counts.Resubmission },
          { key: 'Approved', label: 'Approved', count: counts.Approved },
          { key: 'Rejected', label: 'Rejected', count: counts.Rejected },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-6"
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiFileText}
            title={`No ${tab.toLowerCase()} applications`}
            description="Applications will appear here when drivers submit them."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((application) => {
            const approvedDocs = application.documents.filter((doc) => doc.status === 'Approved').length;
            return (
              <div key={application.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={application.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{application.name}</p>
                    <p className="truncate text-xs text-slate-500">{application.email}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {application.motorcycle} · <span className="font-semibold">{application.plateNumber}</span>
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <FiCamera size={13} className="text-slate-400" />
                  {application.vehiclePhotos} vehicle photos
                  <span className="text-slate-300">·</span>
                  <span>{approvedDocs}/{application.documents.length} docs approved</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Applied {timeAgo(application.appliedAt)}</p>
                {application.rejectionReason && tab === 'Rejected' && (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs leading-relaxed text-red-700">
                    {application.rejectionReason}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <Button variant="outline" size="sm" full icon={<FiEye size={14} />} onClick={() => openReview(application)}>
                    Review Application
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `Review Application — ${selected.name}` : 'Review Application'}
        subtitle={selected ? `${selected.motorcycle} · ${selected.plateNumber} · ${selected.city}` : undefined}
        size="lg"
      >
        {selected && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-slate-400">Applied {formatDate(selected.appliedAt)}</span>
              <span className="ml-auto text-xs text-slate-500">
                <span className="font-bold">{selected.vehiclePhotos}</span> vehicle photos
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {selected.documents.map((document) => (
                <div key={document.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{document.label}</p>
                      <p className="text-xs text-slate-400">{document.name}</p>
                    </div>
                    <Badge tone={docTone[document.status]}>{document.status}</Badge>
                  </div>
                  <DocumentPreview document={document} className="mt-3" />
                  {document.note && (
                    <p className="mt-2.5 rounded-lg bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-600">{document.note}</p>
                  )}
                </div>
              ))}
            </div>

            {action && (
              <div className={cn('mt-5 rounded-xl border p-4', action === 'reject' ? 'border-red-200 bg-red-50/50' : action === 'resubmit' ? 'border-blue-200 bg-blue-50/50' : 'border-green-200 bg-green-50/50')}>
                <Textarea
                  label={action === 'approve' ? 'Approval note (optional)' : action === 'reject' ? 'Rejection reason' : 'Resubmission instructions'}
                  placeholder={action === 'reject' ? 'Explain why the application is being rejected…' : 'Tell the applicant which documents need attention…'}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
              {action === null ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setAction('resubmit'); setNote(''); }}>
                    Request Resubmission
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { setAction('reject'); setNote(''); }}>
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => runAction('approve')} loading={mutation.isPending}>
                    Approve Application
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setAction(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant={action === 'reject' ? 'danger' : action === 'resubmit' ? 'secondary' : 'primary'}
                    size="sm"
                    loading={mutation.isPending}
                    onClick={() => runAction(action)}
                  >
                    {action === 'approve' ? 'Confirm Approval' : action === 'reject' ? 'Confirm Rejection' : 'Send Request'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
