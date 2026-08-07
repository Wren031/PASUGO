import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface MapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
  driverLabel?: string;
  eta?: string;
  className?: string;
  zoom?: boolean;
}

export default function MapPlaceholder({
  pickup = 'Pickup',
  dropoff = 'Destination',
  driverLabel = 'Driver',
  eta,
  className,
  zoom,
}: MapPlaceholderProps) {
  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl border border-slate-200 bg-[#eef2f6]', className)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="roads" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="120" stroke="#ffffff" strokeWidth="10" />
            <line x1="0" y1="0" x2="120" y2="0" stroke="#ffffff" strokeWidth="8" />
          </pattern>
          <pattern id="minor" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#e2e8f0" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="#eef2f6" />
        <rect width="400" height="300" fill="url(#minor)" />
        <rect width="400" height="300" fill="url(#roads)" opacity="0.6" />
        <line x1="30" y1="40" x2="300" y2="60" stroke="#ffffff" strokeWidth="14" />
        <line x1="40" y1="260" x2="360" y2="220" stroke="#ffffff" strokeWidth="12" />
        <path
          d="M 55 240 C 130 220, 170 120, 320 70"
          fill="none"
          stroke="#F97316"
          strokeWidth="4"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
        <circle cx="55" cy="240" r="9" fill="#F97316" stroke="#ffffff" strokeWidth="3" />
        <circle cx="320" cy="70" r="9" fill="#0EA5E9" stroke="#ffffff" strokeWidth="3" />
        <circle cx="150" cy="175" r="7" fill="#22C55E" stroke="#ffffff" strokeWidth="3" />
        <circle cx="150" cy="175" r="15" fill="#22C55E" opacity="0.25" />
      </svg>
      <div className="relative z-10 flex h-full flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            <FiMapPin size={12} className="text-primary-500" /> {pickup}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            <FiNavigation size={12} className="text-blue-500" /> {dropoff}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-green-500" /> {driverLabel}
          </span>
          {eta && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700">
              ETA {eta}
            </span>
          )}
        </div>
      </div>
      {zoom && (
        <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-500">
          <span className="flex h-7 w-7 items-center justify-center border-b border-slate-100 text-sm">+</span>
          <span className="flex h-7 w-7 items-center justify-center text-sm">−</span>
        </div>
      )}
    </div>
  );
}
