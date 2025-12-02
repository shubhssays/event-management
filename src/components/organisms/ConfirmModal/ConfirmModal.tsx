import React, { useEffect } from 'react';
import styles from './ConfirmModal.module.css';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  icon = '❓',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onCancel();
        }
      }}
    >
      <div className={styles.modal} role="dialog" aria-labelledby="modal-title">
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}>{icon}</span>
          <div>
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
            <p className={styles.modalMessage}>{message}</p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles.modalButton} ${styles.confirmButton} ${
              confirmVariant === 'danger' ? styles.danger : confirmVariant === 'success' ? styles.success : ''
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.spinner} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
