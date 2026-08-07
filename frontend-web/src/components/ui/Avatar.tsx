import { cn } from '@/lib/utils';
import { initials } from '@/utils/format';

type AvatarTone = 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'cyan' | 'slate';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  tone?: AvatarTone;
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const toneClasses: Record<AvatarTone, string> = {
  orange: 'bg-primary-100 text-primary-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  pink: 'bg-pink-100 text-pink-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  slate: 'bg-slate-200 text-slate-700',
};

function toneFromName(name: string): AvatarTone {
  const tones: AvatarTone[] = ['orange', 'blue', 'green', 'purple', 'pink', 'cyan', 'slate'];
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tones[sum % tones.length];
}

const statusDot: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-green-500',
  offline: 'bg-slate-400',
  busy: 'bg-amber-500',
};

export default function Avatar({ name, size = 'md', status, tone, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          sizeClasses[size],
          tone ?? toneFromName(name),
        )}
      >
        {initials(name)}
      </span>
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white',
            statusDot[status],
          )}
        />
      )}
    </div>
  );
}
