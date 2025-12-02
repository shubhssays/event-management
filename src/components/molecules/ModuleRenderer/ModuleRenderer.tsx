import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { moduleDataAtom } from '../../../store/eventStore';
import { useEventStore } from '../../../store/eventStore';
import { useSaveModuleData } from '../../../hooks/useEventQueries';
import { MODULE_CONFIGS } from '../../../config/modules.config';
import type { ModuleType } from '../../../types/module.types';
import { CapacityModule } from '../../modules/CapacityModule';
import { LinksModule } from '../../modules/LinksModule';
import { PhotoGalleryModule } from '../../modules/PhotoGalleryModule';
import { PrivacyModule } from '../../modules/PrivacyModule';
import { AnnouncementsModule } from '../../modules/AnnouncementsModule';
import { RSVPModule } from '../../modules/RSVPModule';

interface ModuleRendererProps {
  moduleId: string;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ moduleId }) => {
  const allModuleData = useRecoilValue(moduleDataAtom);
  const moduleData = allModuleData[moduleId];
  const { removeModule, setModuleData } = useEventStore();
  
  const { mutate: saveModuleData } = useSaveModuleData();
  
  const moduleType = moduleId.split('_')[0] as ModuleType;
  const config = MODULE_CONFIGS.find(c => c.type === moduleType);

  const handleChange = (data: Record<string, unknown>) => {
    // Optimistically updating the local state
    setModuleData(moduleId, data);
    // Saving to backend
    saveModuleData({ moduleId, data });
  };

  const handleRemove = () => {
    removeModule(moduleId);
  };

  // Initializing with default data if not present
  useEffect(() => {
    if (config && !moduleData) {
      setModuleData(moduleId, config.defaultData);
    }
  }, [config, moduleData, setModuleData, moduleId]);

  if (!config) return null;
  
  // Waiting for initialization
  if (!moduleData) return null;

  const moduleProps = {
    moduleId,
    data: moduleData || config.defaultData,
    onChange: handleChange,
    onRemove: handleRemove,
  };

  switch (moduleType) {
    case 'capacity':
      return <CapacityModule {...moduleProps} />;
    case 'links':
      return <LinksModule {...moduleProps} />;
    case 'photo-gallery':
      return <PhotoGalleryModule {...moduleProps} />;
    case 'privacy':
      return <PrivacyModule {...moduleProps} />;
    case 'announcements':
      return <AnnouncementsModule {...moduleProps} />;
    case 'rsvp':
      return <RSVPModule {...moduleProps} />;
    default:
      return null;
  }
};
