import { FiBookOpen, FiHome, FiMessageCircle, FiSearch, FiUser } from 'react-icons/fi';
import MapPlaceholder from '@/components/common/MapPlaceholder';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[290px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-b from-primary-200/60 to-transparent" />
      <div className="overflow-hidden rounded-[2.4rem] border-[10px] border-slate-900 bg-white">
        <div className="flex items-center justify-between bg-white px-5 pb-2 pt-4">
          <span className="text-[11px] font-bold text-slate-900">9:41</span>
          <span className="h-4 w-16 rounded-full bg-slate-900" />
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-900">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 5G
          </span>
        </div>

        <div className="bg-gradient-to-b from-primary-500 to-primary-600 px-4 pb-3 pt-2 text-white">
          <p className="text-[10px] font-medium text-primary-100">Good morning, Maria!</p>
          <p className="text-sm font-bold">Where are you headed?</p>
        </div>

        <div className="px-4 pt-3">
          <MapPlaceholder pickup="Cubao" dropoff="BGC" driverLabel="Rider nearby" eta="4 min" className="h-40" />
        </div>

        <div className="space-y-2 px-4 pt-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <FiSearch size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400">Search destination…</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500 text-[11px] font-bold text-white">
              ₱
            </span>
            <span className="text-xs font-semibold text-primary-700">Estimate ₱84 · 12 min</span>
            <span className="ml-auto rounded-full bg-primary-500 px-3 py-1 text-[11px] font-bold text-white">Book</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5">
            <Avatar name="Arman Castillo" size="sm" status="online" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-900">Arman C. <span className="text-slate-400">·</span> <RatingStars value={4.9} size={9} /></p>
              <p className="truncate text-[10px] text-slate-400">Honda TMX 125 · ABC-1234</p>
            </div>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">Track</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-around border-t border-slate-100 px-4 py-3">
          <FiHome size={16} className="text-primary-500" />
          <FiBookOpen size={16} className="text-slate-300" />
          <FiMessageCircle size={16} className="text-slate-300" />
          <FiUser size={16} className="text-slate-300" />
        </div>
      </div>
    </div>
  );
}
