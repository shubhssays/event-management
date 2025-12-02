import React from 'react';
import { useEventStore } from '../../../store/eventStore';
import { MODULE_CONFIGS } from '../../../config/modules.config';
import { Button } from '../../atoms/Button/Button';
import { ModuleRenderer } from '../../molecules/ModuleRenderer/ModuleRenderer';
import styles from './QuickLinksPanel.module.css';

export const QuickLinksPanel: React.FC = () => {
  const { activeModules, showMoreModules: showMore, addModule, toggleShowMoreModules } = useEventStore();

  const availableModules = MODULE_CONFIGS.filter(config => {
    const count = activeModules.filter(id => id.startsWith(config.type)).length;
    return !config.maxInstances || count < config.maxInstances;
  });

  const visibleModules = showMore ? availableModules : availableModules.slice(0, 3);

  const handleAddModule = (moduleType: string) => {
    // eslint-disable-next-line react-hooks/purity
    const moduleId = `${moduleType}_${Date.now()}`;
    addModule(moduleId);
  };

  return (
    <div className={styles.container}>
      {/* Active Modules */}
      <div className={styles.activeModules}>
        {activeModules.map(moduleId => (
          <ModuleRenderer key={moduleId} moduleId={moduleId} />
        ))}
      </div>

      {/* Available Modules to Add */}
      {availableModules.length > 0 && (
        <div className={styles.availableModules}>
          {visibleModules.map(config => (
            <Button
              key={config.id}
              variant="outline"
              size="sm"
              icon="+"
              onClick={() => handleAddModule(config.type)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddModule(config.type);
                }
              }}
            >
              {config.label}
            </Button>
          ))}
          {availableModules.length > 3 && (
            <button
              className={styles.showMoreButton}
              onClick={toggleShowMoreModules}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  toggleShowMoreModules();
                }
              }}
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
