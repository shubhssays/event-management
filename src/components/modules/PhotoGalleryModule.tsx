import React from 'react';
import type { ModuleProps, PhotoGalleryData } from '../../types/module.types';
import { Button } from '../atoms/Button/Button';
import styles from './shared/ModuleBase.module.css';

export const PhotoGalleryModule: React.FC<ModuleProps> = ({ data, onRemove }) => {
  const photoData = data as unknown as PhotoGalleryData;
  const hasPhotos = photoData?.photos && photoData.photos.length > 0;

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>📷</span>
        <span className={styles.moduleTitle}>Photo Gallery</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove photo gallery">
          ×
        </button>
      </div>
      <div className={styles.moduleContent}>
        {!hasPhotos ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateIcon}>📸</span>
            <p className={styles.emptyStateText}>No photos yet — Add photos to your gallery</p>
            <Button variant="ghost" size="sm" icon="+">
              Add photo
            </Button>
          </div>
        ) : (
          <div className={styles.modulePlaceholder}>
            <p>Photo gallery with {photoData.photos.length} photos</p>
          </div>
        )}
      </div>
    </div>
  );
};
