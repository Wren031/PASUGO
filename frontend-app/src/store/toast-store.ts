import { create } from 'zustand';
import { generateId } from '@/utils/mock';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastState {
  toasts: ToastMessage[];
  show: (type: ToastType, title: string, message?: string) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (type, title, message) => {
    const toast: ToastMessage = { id: generateId('t'), type, title, message };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== toast.id) }));
    }, 3200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export const showToast = useToastStore.getState().show;
