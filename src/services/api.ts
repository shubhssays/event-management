import type { EventFormData, EventResponse } from '../types/event.types';

const API_BASE_URL = '/api';

export const apiService = {
  async saveEventDraft(data: EventFormData & { draftId?: string }): Promise<EventResponse> {
    const response = await fetch(`${API_BASE_URL}/events/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getDraft(draftId: string) {
    const response = await fetch(`${API_BASE_URL}/events/draft/${draftId}`);
    return response.json();
  },

  async publishEvent(data: EventFormData & { draftId?: string }): Promise<EventResponse> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getEvent(eventId: string) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    return response.json();
  },

  async validateEvent(data: EventFormData) {
    const response = await fetch(`${API_BASE_URL}/events/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async uploadImage(file: File, type: 'flyer' | 'background') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async getModuleConfigs() {
    const response = await fetch(`${API_BASE_URL}/modules/configs`);
    return response.json();
  },

  async saveModuleData(moduleId: string, data: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
