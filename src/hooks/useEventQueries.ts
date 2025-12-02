import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { apiService } from '../services/api';
import { 
  eventFormAtom, 
  flyerImageAtom, 
  backgroundImageAtom, 
  draftIdAtom, 
  isDraftSavingAtom,
  moduleDataAtom 
} from '../store/eventStore';
import type { EventFormData } from '../types/event.types';

// Query Keys
export const eventKeys = {
  all: ['events'] as const,
  drafts: () => [...eventKeys.all, 'drafts'] as const,
  draft: (id: string) => [...eventKeys.drafts(), id] as const,
  events: () => [...eventKeys.all, 'published'] as const,
  event: (id: string) => [...eventKeys.events(), id] as const,
  validation: (data: EventFormData) => [...eventKeys.all, 'validation', data] as const,
};

export const moduleKeys = {
  all: ['modules'] as const,
  configs: () => [...moduleKeys.all, 'configs'] as const,
  data: (moduleId: string) => [...moduleKeys.all, 'data', moduleId] as const,
};

// Event Draft Hooks
export function useSaveEventDraft() {
  const queryClient = useQueryClient();
  const setDraftId = useSetRecoilState(draftIdAtom);

  return useMutation({
    mutationFn: async (data: EventFormData & { draftId?: string; flyerImageUrl?: string; backgroundImageUrl?: string }) => {
      return apiService.saveEventDraft(data);
    },
    onSuccess: (response) => {
      if (response.draftId) {
        setDraftId(response.draftId);
        // Invalidating draft queries
        queryClient.invalidateQueries({ queryKey: eventKeys.drafts() });
      }
    },
    onError: (error) => {
      console.error('Failed to save draft:', error);
    },
  });
}

export function useGetDraft(draftId: string | null) {
  return useQuery({
    queryKey: eventKeys.draft(draftId || ''),
    queryFn: () => apiService.getDraft(draftId!),
    enabled: !!draftId,
  });
}

// Event Publishing Hooks
export function usePublishEvent() {
  const queryClient = useQueryClient();
  const setDraftId = useSetRecoilState(draftIdAtom);

  return useMutation({
    mutationFn: async (data: EventFormData & { draftId?: string; flyerImageUrl?: string; backgroundImageUrl?: string }) => {
      return apiService.publishEvent(data);
    },
    onSuccess: (response) => {
      // Clearing draft
      setDraftId(null);
      // Invalidating queries
      queryClient.invalidateQueries({ queryKey: eventKeys.events() });
      queryClient.invalidateQueries({ queryKey: eventKeys.drafts() });
      return response;
    },
    onError: (error) => {
      console.error('Failed to publish event:', error);
    },
  });
}

export function useGetEvent(eventId: string | null) {
  return useQuery({
    queryKey: eventKeys.event(eventId || ''),
    queryFn: () => apiService.getEvent(eventId!),
    enabled: !!eventId,
  });
}

// Validation Hook
export function useValidateEvent() {
  return useMutation({
    mutationFn: (data: EventFormData) => apiService.validateEvent(data),
  });
}

// Image Upload Hooks
export function useUploadImage() {
  const setFlyerImage = useSetRecoilState(flyerImageAtom);
  const setBackgroundImage = useSetRecoilState(backgroundImageAtom);
  const backgroundImage = useRecoilValue(backgroundImageAtom);

  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'flyer' | 'background' }) => {
      return apiService.uploadImage(file, type);
    },
    onSuccess: (data, variables) => {
      if (variables.type === 'flyer') {
        setFlyerImage(data);
        // Only setting flyer as background if no background is set
        if (!backgroundImage) {
          setBackgroundImage(data);
        }
      } else {
        // Changing background should only update background image
        setBackgroundImage(data);
      }
    },
    onError: (error) => {
      console.error('Failed to upload image:', error);
    },
  });
}

// Module Hooks
export function useGetModuleConfigs() {
  return useQuery({
    queryKey: moduleKeys.configs(),
    queryFn: () => apiService.getModuleConfigs(),
    staleTime: 1000 * 60 * 60, // 1 hour - configs rarely change
  });
}

export function useSaveModuleData() {
  const queryClient = useQueryClient();
  const setModuleData = useSetRecoilState(moduleDataAtom);
  const moduleData = useRecoilValue(moduleDataAtom);

  return useMutation({
    mutationFn: async ({ moduleId, data }: { moduleId: string; data: Record<string, unknown> }) => {
      return apiService.saveModuleData(moduleId, data);
    },
    onMutate: async ({ moduleId, data }) => {
      // Cancelling any outgoing re-fetches
      await queryClient.cancelQueries({ queryKey: moduleKeys.data(moduleId) });

      // Storing previous data for rollback
      const previousData = moduleData[moduleId];

      setModuleData((prev) => ({
        ...prev,
        [moduleId]: data,
      }));

      // Returning context for rollback
      return { moduleId, previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        setModuleData((prev) => ({
          ...prev,
          [context.moduleId]: context.previousData,
        }));
      }
    },
    onSettled: (_data, _error, variables) => {
      // Invalidating queries
      queryClient.invalidateQueries({ queryKey: moduleKeys.data(variables.moduleId) });
    },
  });
}

// Saving automatically hook with debouncing
export function useAutoSaveDraft() {
  const eventForm = useRecoilValue(eventFormAtom);
  const flyerImage = useRecoilValue(flyerImageAtom);
  const backgroundImage = useRecoilValue(backgroundImageAtom);
  const draftId = useRecoilValue(draftIdAtom);
  const setIsDraftSaving = useSetRecoilState(isDraftSavingAtom);

  const { mutate: saveDraft } = useSaveEventDraft();

  return {
    saveDraft: () => {
      if (eventForm.phoneNumber) {
        setIsDraftSaving(true);
        saveDraft(
          {
            ...eventForm,
            draftId: draftId || undefined,
            flyerImageUrl: flyerImage?.url,
            backgroundImageUrl: backgroundImage?.url,
          },
          {
            onSettled: () => {
              setIsDraftSaving(false);
            },
          }
        );
      }
    },
  };
}
