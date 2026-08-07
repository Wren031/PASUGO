import type { IconType } from 'react-icons';
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import type { Trend } from '@/types/common';

type StatTone = 'orange' | 'green' | 'blue' | 'red' | 'indigo' | 'amber' | 'cyan';

interface StatCardProps {
  label: string;
  value: string;
  icon: IconType;
  tone?: StatTone;
  delta?: string;
  trend?: Trend;
  footer?: string;
}

const toneClasses: Record<StatTone, string> = {
  orange: 'bg-primary-50 text-primary-600',
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600',
  cyan: 'bg-cyan-50 text-cyan-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'orange', delta, trend, footer }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
          <Icon size={18} />
        </span>
      </div>
      {(delta || footer) && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            {trend === 'up' && <FiArrowUpRight size={14} className="text-green-600" />}
            {trend === 'down' && <FiArrowDownRight size={14} className="text-red-600" />}
            <span className={cn(trend === 'up' && 'font-semibold text-green-600', trend === 'down' && 'font-semibold text-red-600')}>
              {delta}
            </span>
          </span>
          {footer && <span className="text-xs text-slate-400">{footer}</span>}
        </div>
      )}
    </div>
  );
}
