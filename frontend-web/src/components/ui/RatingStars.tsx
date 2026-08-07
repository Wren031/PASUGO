import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export default function RatingStars({ value, size = 14, className, showValue }: RatingStarsProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const position = index + 1;
          if (value >= position) {
            return <FaStar key={index} size={size} className="text-amber-400" />;
          }
          if (value >= position - 0.5) {
            return <FaStarHalfAlt key={index} size={size} className="text-amber-400" />;
          }
          return <FaRegStar key={index} size={size} className="text-slate-300" />;
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-slate-700">{value.toFixed(1)}</span>}
    </span>
  );
}
