import React from 'react';
import type { ModuleProps, LinksData } from '../../types/module.types';
import { Input } from '../atoms/Input/Input';
import { Button } from '../atoms/Button/Button';
import styles from './shared/ModuleBase.module.css';

export const LinksModule: React.FC<ModuleProps> = ({ data, onChange, onRemove }) => {
  const linksData = data as unknown as LinksData;
  
  // Check if links array exists
  if (!linksData.links) {
    return null;
  }

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...linksData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ links: newLinks });
  };

  const handleAddLink = () => {
    onChange({ links: [...linksData.links, { label: '', url: '' }] });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = linksData.links.filter((_, i) => i !== index);
    onChange({ links: newLinks });
  };

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleIcon}>🔗</span>
        <span className={styles.moduleTitle}>Links</span>
        <button className={styles.removeButton} onClick={onRemove} aria-label="Remove links">
          ×
        </button>
      </div>
      <div className={styles.moduleContent}>
        {linksData.links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <Input
              placeholder="Label"
              value={link.label}
              onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              type="url"
            />
            {linksData.links.length > 1 && (
              <button 
                className={styles.removeItemButton} 
                onClick={() => handleRemoveLink(index)}
                aria-label="Remove link"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={handleAddLink} icon="+">
          Add another link
        </Button>
      </div>
    </div>
  );
};
