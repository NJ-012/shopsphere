import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now();
    set({
      toasts: [...get().toasts, { id, type, message }],
    });
    // Auto remove after 3 seconds
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => {
    set({
      toasts: get().toasts.filter((toast) => toast.id !== id),
    });
  },
  success: (msg) => get().addToast('success', msg),
  error: (msg) => get().addToast('error', msg),
  info: (msg) => get().addToast('info', msg),
}));

export default useToastStore;

