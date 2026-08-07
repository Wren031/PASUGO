import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        className="h-9 w-9 rounded-full border-[3px] border-primary-500 border-t-transparent"
      />
      <p className="text-xs font-medium text-slate-500">Loading…</p>
    </div>
  );
}
