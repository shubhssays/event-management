import React from 'react';
import type { ModuleProps } from '../../types/module.types';
import styles from './shared/ModuleBase.module.css';

export const AnnouncementsModule: React.FC<ModuleProps> = ({ onRemove }) => {
  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>📢</span>
        <span className={styles.moduleTitle}>Announcements</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove announcements">
          ×
        </button>
      </div>
      <div className={styles.modulePlaceholder}>
        <p>Add announcements for your event</p>
      </div>
    </div>
  );
};
