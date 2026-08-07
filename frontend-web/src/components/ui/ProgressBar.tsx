import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'orange' | 'green' | 'red' | 'blue';
  className?: string;
  label?: string;
}

const toneClasses = {
  orange: 'bg-primary-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};

export default function ProgressBar({ value, max = 100, tone = 'orange', className, label }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{label}</span>
          <span className="font-semibold text-slate-800">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full transition-all duration-500', toneClasses[tone])} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
