import { Badge, type BadgeTone } from './Badge';
import type { BookingStatus } from '@/types/common';

const statusTone: Record<BookingStatus, BadgeTone> = {
  Pending: 'warning',
  'Searching Driver': 'info',
  Accepted: 'info',
  'Driver Arrived': 'primary',
  'In Progress': 'primary',
  Completed: 'success',
  Cancelled: 'danger',
};

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <Badge label={status} tone={statusTone[status] ?? 'neutral'} className={className} />;
}
