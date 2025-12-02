import { http, HttpResponse, delay } from 'msw';
import type { EventFormData, EventResponse } from '../types/event.types';

const DELAY_MS = 500;

// In-memory storage
const drafts: Map<string, EventFormData & { draftId: string; createdAt: string; updatedAt: string }> = new Map();
const events: Map<string, EventFormData & { eventId: string; eventUrl: string; publishedAt: string }> = new Map();

export const handlers = [
  // Api to save event draft
  http.post('/api/events/draft', async ({ request }) => {
    await delay(DELAY_MS);
    
    const data = await request.json() as EventFormData & { draftId?: string };
    const draftId = data.draftId || `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const draft = {
      ...data,
      draftId,
      createdAt: drafts.get(draftId)?.createdAt || now,
      updatedAt: now,
    };

    drafts.set(draftId, draft);

    return HttpResponse.json<EventResponse>({
      success: true,
      message: 'Draft saved successfully',
      draftId,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    });
  }),

  // Api to get draft event
  http.get('/api/events/draft/:draftId', async ({ params }) => {
    await delay(DELAY_MS);
    
    const { draftId } = params;
    const draft = drafts.get(draftId as string);

    if (!draft) {
      return HttpResponse.json(
        { success: false, message: 'Draft not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: draft,
    });
  }),

  // Api to publish event
  http.post('/api/events', async ({ request }) => {
    await delay(DELAY_MS);
    
    const data = await request.json() as EventFormData & { draftId?: string };

    // Validate required fields (title and dateTime per spec)
    if (!data.title) {
      return HttpResponse.json(
        { success: false, message: 'Event title is required' },
        { status: 400 }
      );
    }
    
    if (!data.dateTime) {
      return HttpResponse.json(
        { success: false, message: 'Date and time is required' },
        { status: 400 }
      );
    }

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const eventUrl = `https://letshang.co/events/${eventId}`;
    const now = new Date().toISOString();

    const event = {
      ...data,
      eventId,
      eventUrl,
      publishedAt: now,
    };

    events.set(eventId, event);

    // Remove draft if exists
    if (data.draftId) {
      drafts.delete(data.draftId);
    }

    return HttpResponse.json<EventResponse>({
      success: true,
      message: 'Event published successfully',
      eventId,
      eventUrl,
      publishedAt: now,
    });
  }),

  // Api to get published event
  http.get('/api/events/:eventId', async ({ params }) => {
    await delay(DELAY_MS);
    
    const { eventId } = params;
    const event = events.get(eventId as string);

    if (!event) {
      return HttpResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: event,
    });
  }),

  // Api to validate event
  http.post('/api/events/validate', async ({ request }) => {
    await delay(300);
    
    const data = await request.json() as EventFormData;
    const errors: Array<{ field: string; message: string }> = [];
    const warnings: Array<{ field: string; message: string }> = [];

    // Validation rules - title and dateTime are required per spec
    if (!data.title) {
      errors.push({ field: 'title', message: 'Event title is required' });
    }

    if (!data.dateTime) {
      errors.push({ field: 'dateTime', message: 'Date and time is required' });
    }

    // Warnings for optional but recommended fields
    if (!data.location) {
      warnings.push({ field: 'location', message: 'Location not specified' });
    }

    if (!data.description) {
      warnings.push({ field: 'description', message: 'Description not provided' });
    }
    
    if (!data.phoneNumber) {
      warnings.push({ field: 'phoneNumber', message: 'Phone number not provided (optional)' });
    }

    return HttpResponse.json({
      valid: errors.length === 0,
      errors,
      warnings,
    });
  }),

  // Api to upload image
  http.post('/api/upload', async ({ request }) => {
    await delay(800);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return HttpResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Simulate file upload
    const url = URL.createObjectURL(file);
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return HttpResponse.json({
      success: true,
      url,
      uploadId,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    });
  }),

  // Api to get module configs
  http.get('/api/modules/configs', async () => {
    await delay(300);
    
    return HttpResponse.json({
      success: true,
      modules: [
        {
          id: 'capacity',
          name: 'Capacity',
          icon: '👥',
          description: 'Set guest capacity',
          defaultData: { capacity: 0 },
        },
        {
          id: 'photos',
          name: 'Photo Gallery',
          icon: '📸',
          description: 'Add photo gallery',
          defaultData: { photos: [] },
        },
        {
          id: 'links',
          name: 'Links',
          icon: '🔗',
          description: 'Add custom links',
          defaultData: { links: [] },
        },
        {
          id: 'privacy',
          name: 'Privacy',
          icon: '🔒',
          description: 'Privacy settings',
          defaultData: { isPrivate: false },
        },
        {
          id: 'announcements',
          name: 'Announcements',
          icon: '📢',
          description: 'Add announcements',
          defaultData: { announcements: [] },
        },
        {
          id: 'rsvp',
          name: 'RSVP',
          icon: '✉️',
          description: 'RSVP management',
          defaultData: { enabled: true },
        },
      ],
    });
  }),

  // Api to save module data
  http.post('/api/modules/:moduleId', async ({ params }) => {
    await delay(300);
    
    const { moduleId } = params;

    return HttpResponse.json({
      success: true,
      moduleId,
      savedAt: new Date().toISOString(),
    });
  }),
];
