import type { IconType } from 'react-icons';
import { FiAlertCircle, FiBookOpen, FiCreditCard, FiShield, FiUser, FiUsers, FiZap } from 'react-icons/fi';
import Avatar from '@/components/ui/Avatar';
import { timeAgo } from '@/utils/format';
import type { RecentActivity } from '../types';
import { cn } from '@/lib/utils';

const activityConfig: Record<RecentActivity['type'], { icon: IconType; className: string }> = {
  booking: { icon: FiBookOpen, className: 'bg-orange-50 text-orange-600' },
  driver: { icon: FiShield, className: 'bg-blue-50 text-blue-600' },
  payment: { icon: FiCreditCard, className: 'bg-green-50 text-green-600' },
  passenger: { icon: FiUsers, className: 'bg-indigo-50 text-indigo-600' },
  system: { icon: FiZap, className: 'bg-amber-50 text-amber-600' },
  complaint: { icon: FiAlertCircle, className: 'bg-red-50 text-red-600' },
};

export default function RecentActivities({ items }: { items: RecentActivity[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((activity) => {
        const config = activityConfig[activity.type];
        const Icon = config.icon;
        return (
          <li key={activity.id} className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', config.className)}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{activity.description}</p>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(activity.timestamp)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ActivitySkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-slate-100">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-3.5 py-3.5">
          <span className="h-9 w-9 rounded-lg bg-slate-100" />
          <div className="flex-1 space-y-2">
            <span className="block h-3 w-3/5 rounded bg-slate-100" />
            <span className="block h-2.5 w-2/5 rounded bg-slate-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ActivityAvatar({ name }: { name: string }) {
  return <Avatar name={name} size="sm" />;
}
