export type ModuleType = 
  | 'capacity' 
  | 'photo-gallery' 
  | 'links' 
  | 'privacy' 
  | 'announcements' 
  | 'rsvp';

export interface ModuleConfig {
  id: string;
  type: ModuleType;
  label: string;
  icon: string;
  description: string;
  maxInstances?: number;
  defaultData: Record<string, unknown>;
}

export interface ModuleInstance {
  id: string;
  type: ModuleType;
  data: Record<string, unknown>;
}

export interface ModuleProps {
  moduleId: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  onRemove: () => void;
}

// Specific module data types
export interface CapacityData {
  capacity: number;
}

export interface PhotoGalleryData {
  photos: Array<{
    url: string;
    caption?: string;
  }>;
}

export interface LinksData {
  links: Array<{
    label: string;
    url: string;
  }>;
}

export interface PrivacyData {
  isPrivate: boolean;
  allowedDomains?: string[];
}

export interface AnnouncementsData {
  announcements: Array<{
    title: string;
    content: string;
    timestamp?: string;
  }>;
}

export interface RSVPData {
  requireRSVP: boolean;
  deadline?: string;
  customQuestions?: Array<{
    question: string;
    type: 'text' | 'select' | 'multiselect';
  }>;
}
