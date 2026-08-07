import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { useToastStore } from '@/app/store/toast-store';
import { cn } from '@/lib/utils';

const toastConfig = {
  success: { icon: FiCheckCircle, accent: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50' },
  error: { icon: FiAlertCircle, accent: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' },
  info: { icon: FiInfo, accent: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn('pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4', config.border)}
              role="status"
            >
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg, config.accent)}>
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-xs text-slate-500">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Dismiss notification"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
