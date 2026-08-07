import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('scrollbar-none flex gap-1 overflow-x-auto border-b border-slate-200', className)}>
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              'relative flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  active ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {item.count}
              </span>
            )}
            {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary-500" />}
          </button>
        );
      })}
    </div>
  );
}
