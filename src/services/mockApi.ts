import type { IEventAPI } from './apiInterface';
import type { EventFormData, EventResponse, ImageData, ValidationResult, ValidationError } from '../types/event.types';
import type { ModuleConfig } from '../types/module.types';
import { MODULE_CONFIGS } from '../config/modules.config';

class MockEventAPI implements IEventAPI {
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveEventDraft(data: EventFormData): Promise<EventResponse> {
    await this.delay(300);
    
    const draftId = data.draftId || `draft_${Date.now()}`;
    const draftData = {
      ...data,
      id: draftId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(draftId, JSON.stringify(draftData));
    
    return {
      success: true,
      draftId,
      createdAt: draftData.createdAt,
      updatedAt: draftData.updatedAt,
    };
  }

  async getEventDraft(draftId: string): Promise<{ success: boolean; draft: EventFormData & { id: string; createdAt: string; updatedAt: string } }> {
    await this.delay(200);
    
    const data = localStorage.getItem(draftId);
    if (!data) {
      throw new Error('Draft not found');
    }
    
    return {
      success: true,
      draft: JSON.parse(data),
    };
  }

  async publishEvent(data: EventFormData): Promise<EventResponse> {
    await this.delay(500);
    
    // Validating event before publishing
    const validation = await this.validateEvent(data);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => e.message).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    const eventId = `event_${Date.now()}`;
    const eventData = {
      ...data,
      id: eventId,
      status: 'published',
      publishedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(eventId, JSON.stringify(eventData));
    
    // Clearing draft if it exists
    if (data.draftId) {
      localStorage.removeItem(data.draftId);
    }
    
    return {
      success: true,
      eventId,
      eventUrl: `https://letshang.co/event/${eventId}`,
      publishedAt: eventData.publishedAt,
    };
  }

  async uploadImage(file: File, type: 'flyer' | 'background'): Promise<ImageData> {
    await this.delay(400);
    
    // Validating image file
    if (!this.isValidImageFile(file)) {
      throw new Error('Invalid image file. Please upload JPEG, PNG, WebP or GIF.');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit.');
    }
    
    // Converting to data URL (mock upload)
    const url = await this.fileToDataURL(file);
    const fileId = `file_${type}_${Date.now()}`;
    
    // Getting image dimensions
    const metadata = await this.getImageMetadata(url);
    
    return {
      url,
      fileId,
      metadata,
    };
  }

  async getModuleConfigs(): Promise<ModuleConfig[]> {
    await this.delay(200);
    return MODULE_CONFIGS;
  }

  async saveModuleData(moduleId: string, data: Record<string, unknown>): Promise<{ success: boolean; moduleInstanceId: string; savedAt: string }> {
    await this.delay(200);
    
    localStorage.setItem(`module_${moduleId}`, JSON.stringify(data));
    
    return {
      success: true,
      moduleInstanceId: `module_${moduleId}_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
  }

  async validateEvent(data: EventFormData): Promise<ValidationResult> {
    await this.delay(150);
    
    const errors = this.validateEventData(data);
    const warnings = this.getEventWarnings(data);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Helper methods
  private validateEventData(data: EventFormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!data.phoneNumber) {
      errors.push({
        field: 'phoneNumber',
        message: 'Phone number is required',
        code: 'REQUIRED_FIELD',
      });
    }
    
    if (!data.location) {
      errors.push({
        field: 'location',
        message: 'Location is required',
        code: 'REQUIRED_FIELD',
      });
    }
    
    if (!data.dateTime) {
      errors.push({
        field: 'dateTime',
        message: 'Date and time is required',
        code: 'REQUIRED_FIELD',
      });
    } else if (new Date(data.dateTime) < new Date()) {
      errors.push({
        field: 'dateTime',
        message: 'Date must be in the future',
        code: 'INVALID_DATE',
      });
    }
    
    return errors;
  }

  private getEventWarnings(data: EventFormData): ValidationError[] {
    const warnings: ValidationError[] = [];
    
    if (data.description && data.description.length < 20) {
      warnings.push({
        field: 'description',
        message: 'Description is quite short. Consider adding more details.',
      });
    }
    
    if (!data.costPerPerson) {
      warnings.push({
        field: 'costPerPerson',
        message: 'Consider specifying if the event is free or paid.',
      });
    }
    
    return warnings;
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getImageMetadata(dataUrl: string): Promise<{ width: number; height: number; size: number; format: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: dataUrl.length,
          format: dataUrl.split(';')[0].split('/')[1],
        });
      };
      img.src = dataUrl;
    });
  }
}

export const mockApi = new MockEventAPI();
export default mockApi;
