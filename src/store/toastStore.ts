import { atom, useRecoilState, useSetRecoilState } from 'recoil';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// for toast state
export const toastsAtom = atom<Toast[]>({
  key: 'toasts',
  default: [],
});

// for toast management
export const useToastStore = () => {
  const [toasts, setToasts] = useRecoilState(toastsAtom);

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Automatically removing after duration (default 5000ms for errors, 3000ms for others)
    const duration = toast.duration ?? (toast.type === 'error' ? 5000 : 3000);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };
};

// Helper hook for easy toast usage
export const useToast = () => {
  const setToasts = useSetRecoilState(toastsAtom);
  
  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Automatically removing after duration
    const duration = toast.duration ?? (toast.type === 'error' ? 5000 : 3000);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    
    return id;
  };

  return {
    success: (message: string, duration?: number) =>
      addToast({ message, type: 'success', duration }),
    
    error: (message: string, action?: Toast['action'], duration?: number) =>
      addToast({ message, type: 'error', action, duration }),
    
    warning: (message: string, duration?: number) =>
      addToast({ message, type: 'warning', duration }),
    
    info: (message: string, duration?: number) =>
      addToast({ message, type: 'info', duration }),
  };
};
