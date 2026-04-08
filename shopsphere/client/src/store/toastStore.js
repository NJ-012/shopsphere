import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (messageOrType, maybeType) => {
    const type = ['success', 'error', 'info'].includes(maybeType) ? maybeType : messageOrType;
    const message = ['success', 'error', 'info'].includes(maybeType) ? messageOrType : maybeType;
    const id = Date.now() + Math.random();

    set({
      toasts: [...get().toasts, { id, type: type || 'info', message: message || '' }],
    });

    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => {
    set({
      toasts: get().toasts.filter((toast) => toast.id !== id),
    });
  },
  success: (message) => get().addToast(message, 'success'),
  error: (message) => get().addToast(message, 'error'),
  info: (message) => get().addToast(message, 'info'),
}));

export default useToastStore;
