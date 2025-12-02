import React from 'react';
import type { ModuleProps, PrivacyData } from '../../types/module.types';
import styles from './shared/ModuleBase.module.css';

export const PrivacyModule: React.FC<ModuleProps> = ({ data, onChange, onRemove }) => {
  const privacyData = data as unknown as PrivacyData;
  
  if (!privacyData || privacyData.isPrivate === undefined) {
    return null;
  }

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>🔒</span>
        <span className={styles.moduleTitle}>Privacy</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove privacy">
          ×
        </button>
      </div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={privacyData.isPrivate}
          onChange={(e) => onChange({ ...privacyData, isPrivate: e.target.checked })}
        />
        <span>Make event private</span>
      </label>
    </div>
  );
};
