import { create } from 'zustand';
import type { ToastMessage, ToastType } from '@/types/common';

interface ToastState {
  toasts: ToastMessage[];
  notify: (type: ToastType, title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  notify: (type, title, message) => {
    const id = `toast-${Date.now()}-${toastCounter++}`;
    set((state) => ({ toasts: [...state.toasts, { id, type, title, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, message?: string) => useToastStore.getState().notify('success', title, message),
  error: (title: string, message?: string) => useToastStore.getState().notify('error', title, message),
  info: (title: string, message?: string) => useToastStore.getState().notify('info', title, message),
};
