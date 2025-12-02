import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { flyerImageAtom } from '../../../store/eventStore';
import { useUploadImage } from '../../../hooks/useEventQueries';
import { useToast } from '../../../store/toastStore';
import { Button } from '../../atoms/Button/Button';
import styles from './FlyerSection.module.css';

export const FlyerSection: React.FC = () => {
  const flyerImage = useRecoilValue(flyerImageAtom);
  const flyerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  const { mutate: uploadImage } = useUploadImage();
  const toast = useToast();

  const handleFlyerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Checking if file size is greater than 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('File is larger than 5MB. Upload may take longer.', 4000);
    }

    setUploadingFlyer(true);
    uploadImage(
      { file, type: 'flyer' },
      {
        onSuccess: () => {
          setUploadingFlyer(false);
          toast.success('Flyer uploaded successfully');
        },
        onError: (error) => {
          setUploadingFlyer(false);
          toast.error(
            error instanceof Error ? error.message : 'Failed to upload flyer',
            {
              label: 'Retry',
              onClick: () => handleFlyerUpload(e),
            },
            0
          );
        },
      }
    );
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('File is larger than 5MB. Upload may take longer.', 4000);
    }

    setUploadingBackground(true);
    uploadImage(
      { file, type: 'background' },
      {
        onSuccess: () => {
          setUploadingBackground(false);
          toast.success('Background uploaded successfully');
        },
        onError: (error) => {
          setUploadingBackground(false);
          toast.error(
            error instanceof Error ? error.message : 'Failed to upload background',
            {
              label: 'Retry',
              onClick: () => handleBackgroundUpload(e),
            },
            0
          );
        },
      }
    );
  };

  return (
    <div className={styles.flyerSection}>
      <div 
        className={styles.flyerPreview}
        onClick={() => !uploadingFlyer && flyerInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && !uploadingFlyer && flyerInputRef.current?.click()}
      >
        <img 
          src={flyerImage?.url || "https://letshang.co/assets/event-default-bg-8jRl328f.png"} 
          alt="Event flyer" 
          className={styles.flyerImage} 
        />
        <button 
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            if (!uploadingFlyer) flyerInputRef.current?.click();
          }}
          aria-label="Edit flyer"
          disabled={uploadingFlyer}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        {uploadingFlyer && (
          <div className={styles.uploadOverlay}>
            <div className={styles.spinner} />
            <p className={styles.uploadText}>Uploading flyer...</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarFill} />
            </div>
          </div>
        )}
        {!flyerImage && !uploadingFlyer && (
          <div className={styles.flyerPlaceholder}>

          </div>
        )}
      </div>

      <Button
        variant="primary"
        onClick={() => backgroundInputRef.current?.click()}
        icon="🖼️"
        fullWidth
        disabled={uploadingBackground}
      >
        {uploadingBackground ? 'Uploading...' : 'Change background'}
      </Button>

      <input
        ref={flyerInputRef}
        type="file"
        accept="image/*"
        onChange={handleFlyerUpload}
        style={{ display: 'none' }}
        aria-label="Upload flyer image"
      />
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        style={{ display: 'none' }}
        aria-label="Upload background image"
      />
    </div>
  );
};
