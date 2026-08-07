import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: string;
  value: string;
  strong?: boolean;
  className?: string;
}

export default function InfoRow({ label, value, strong, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 py-1.5', className)}>
      <span className="text-xs text-slate-500">{label}</span>
      <span className={cn('text-right text-sm', strong ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>
        {value}
      </span>
    </div>
  );
}
