import React from 'react';
import type { ModuleProps, CapacityData } from '../../types/module.types';
import { Input } from '../atoms/Input/Input';
import styles from './shared/ModuleBase.module.css';

export const CapacityModule: React.FC<ModuleProps> = ({ data, onChange, onRemove }) => {
  const capacityData = data as unknown as CapacityData;
  
  if (!capacityData || capacityData.capacity === undefined) {
    return null;
  }

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>👥</span>
        <span className={styles.moduleTitle}>Capacity</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove capacity">
          ×
        </button>
      </div>
      <Input
        type="number"
        placeholder="Enter guest capacity"
        value={capacityData.capacity}
        onChange={(e) => onChange({ capacity: parseInt(e.target.value) || 0 })}
        min="1"
      />
    </div>
  );
};
