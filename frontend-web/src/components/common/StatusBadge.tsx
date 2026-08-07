import Badge, { type BadgeTone } from '@/components/ui/Badge';

const statusToneMap: Record<string, BadgeTone> = {
  active: 'green',
  online: 'green',
  available: 'green',
  completed: 'green',
  approved: 'green',
  success: 'green',
  sent: 'green',
  resolved: 'green',
  visible: 'green',
  verified: 'green',
  delivered: 'green',
  enabled: 'green',
  paid: 'green',

  pending: 'amber',
  'under review': 'amber',
  resubmission: 'amber',
  flagged: 'amber',
  paused: 'amber',
  low: 'amber',
  checking: 'amber',

  'searching driver': 'blue',
  accepted: 'blue',
  scheduled: 'blue',
  'on trip': 'blue',

  'in progress': 'indigo',
  processing: 'indigo',
  refunded: 'indigo',

  'driver arrived': 'cyan',

  cancelled: 'red',
  suspended: 'red',
  failed: 'red',
  rejected: 'red',
  expired: 'red',
  open: 'red',
  inactive: 'red',
  offline: 'red',
  removed: 'red',
  blocked: 'red',
  high: 'red',
  disabled: 'red',

  draft: 'slate',
  offline_drivers: 'slate',
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status.toLowerCase()] ?? 'slate';
  return <Badge tone={tone}>{status}</Badge>;
}
