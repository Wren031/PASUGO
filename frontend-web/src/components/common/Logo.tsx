import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-lg',
  lg: 'h-12 w-12 text-xl',
};

export default function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-xl bg-primary-500 font-extrabold text-white',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      P
    </span>
  );
}
