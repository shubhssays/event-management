import type { EventFormData, EventResponse, ImageData, ValidationResult } from '../types/event.types';
import type { ModuleConfig } from '../types/module.types';

export interface IEventAPI {
  saveEventDraft(data: EventFormData): Promise<EventResponse>;
  getEventDraft(draftId: string): Promise<{ success: boolean; draft: EventFormData & { id: string; createdAt: string; updatedAt: string } }>;
  publishEvent(data: EventFormData): Promise<EventResponse>;
  uploadImage(file: File, type: 'flyer' | 'background'): Promise<ImageData>;
  getModuleConfigs(): Promise<ModuleConfig[]>;
  saveModuleData(moduleId: string, data: Record<string, unknown>): Promise<{ success: boolean; moduleInstanceId: string; savedAt: string }>;
  validateEvent(data: EventFormData): Promise<ValidationResult>;
}
