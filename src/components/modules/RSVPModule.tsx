import React from 'react';
import type { ModuleProps, RSVPData } from '../../types/module.types';
import styles from './shared/ModuleBase.module.css';

export const RSVPModule: React.FC<ModuleProps> = ({ data, onChange, onRemove }) => {
  const rsvpData = data as unknown as RSVPData;
  
  if (!rsvpData || rsvpData.requireRSVP === undefined) {
    return null;
  }

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>✓</span>
        <span className={styles.moduleTitle}>RSVP</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove RSVP">
          ×
        </button>
      </div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={rsvpData.requireRSVP}
          onChange={(e) => onChange({ ...rsvpData, requireRSVP: e.target.checked })}
        />
        <span>Require RSVP</span>
      </label>
    </div>
  );
};
