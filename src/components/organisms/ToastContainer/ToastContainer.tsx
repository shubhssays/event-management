import React from 'react';
import { useToastStore } from '../../../store/toastStore';
import styles from './ToastContainer.module.css';

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '📢';
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.toastIcon}>{getIcon(toast.type)}</span>
          
          <div className={styles.toastContent}>
            <div className={styles.toastMessage}>{toast.message}</div>
            
            {toast.action && (
              <div className={styles.toastActions}>
                <button
                  className={`${styles.toastAction} ${styles.primary}`}
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <button
            className={styles.closeButton}
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
