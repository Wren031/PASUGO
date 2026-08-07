import type { ReactNode } from 'react';
import { FiCheck, FiClock, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import type { TimelineEvent } from '@/types/common';

interface TimelineProps {
  items: TimelineEvent[];
  className?: string;
}

const statusConfig = {
  done: { icon: FiCheck, className: 'bg-green-500 text-white border-green-500', line: 'bg-green-200' },
  current: { icon: FiClock, className: 'bg-primary-500 text-white border-primary-500', line: 'bg-slate-200' },
  pending: { icon: undefined, className: 'bg-white text-slate-400 border-slate-300', line: 'bg-slate-200' },
  failed: { icon: FiX, className: 'bg-red-500 text-white border-red-500', line: 'bg-red-200' },
};

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('space-y-0', className)}>
      {items.map((item, index) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <span className={cn('absolute left-[13px] top-8 h-full w-0.5', config.line)} />}
            <span
              className={cn(
                'z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                config.className,
              )}
            >
              {Icon ? <Icon size={13} /> : null}
            </span>
            <div className="flex-1 pt-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={cn('text-sm', item.status === 'pending' ? 'font-medium text-slate-400' : 'font-semibold text-slate-800')}>
                  {item.label}
                </p>
                {item.timestamp && <span className="text-xs text-slate-400">{item.timestamp}</span>}
              </div>
              {item.description && <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
