import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import type { EventFormData, ImageData } from '../types/event.types';

const { persistAtom } = recoilPersist({
  key: 'event-storage',
  storage: localStorage,
});

export const initialEventForm: EventFormData = {
  title: '',
  phoneNumber: '',
  dateTime: '',
  location: '',
  costPerPerson: '',
  description: '',
};

// Atoms for event state
export const eventFormAtom = atom<EventFormData>({
  key: 'eventForm',
  default: initialEventForm,
  effects_UNSTABLE: [persistAtom],
});

export const flyerImageAtom = atom<ImageData | null>({
  key: 'flyerImage',
  default: null,
});

export const backgroundImageAtom = atom<ImageData | null>({
  key: 'backgroundImage',
  default: null,
});

export const isDraftSavingAtom = atom<boolean>({
  key: 'isDraftSaving',
  default: false,
});

export const draftIdAtom = atom<string | null>({
  key: 'draftId',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const activeModulesAtom = atom<string[]>({
  key: 'activeModules',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const moduleDataAtom = atom<Record<string, Record<string, unknown>>>({
  key: 'moduleData',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const showMoreModulesAtom = atom<boolean>({
  key: 'showMoreModules',
  default: false,
});

export const useEventStore = () => {
  const [eventForm, setEventFormState] = useRecoilState(eventFormAtom);
  const [flyerImage, setFlyerImage] = useRecoilState(flyerImageAtom);
  const [backgroundImage, setBackgroundImage] = useRecoilState(backgroundImageAtom);
  const [isDraftSaving, setIsDraftSaving] = useRecoilState(isDraftSavingAtom);
  const [draftId, setDraftId] = useRecoilState(draftIdAtom);
  const [activeModules, setActiveModules] = useRecoilState(activeModulesAtom);
  const [moduleData, setModuleData] = useRecoilState(moduleDataAtom);
  const [showMoreModules, setShowMoreModules] = useRecoilState(showMoreModulesAtom);

  const setEventForm = (form: Partial<EventFormData>) => {
    setEventFormState((prev) => ({ ...prev, ...form }));
  };

  const addModule = (moduleId: string) => {
    setActiveModules((prev) => 
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  };

  const removeModule = (moduleId: string) => {
    setActiveModules((prev) => prev.filter((id) => id !== moduleId));
  };

  const setModuleDataById = (moduleId: string, data: Record<string, unknown>) => {
    setModuleData((prev) => ({
      ...prev,
      [moduleId]: data,
    }));
  };

  const toggleShowMoreModules = () => {
    setShowMoreModules((prev) => !prev);
  };

  const resetEventForm = () => {
    setEventFormState(initialEventForm);
    setFlyerImage(null);
    setBackgroundImage(null);
    setIsDraftSaving(false);
    setDraftId(null);
    setActiveModules([]);
    setModuleData({});
  };

  return {
    eventForm,
    flyerImage,
    backgroundImage,
    isDraftSaving,
    draftId,
    activeModules,
    moduleData,
    showMoreModules,
    setEventForm,
    setFlyerImage,
    setBackgroundImage,
    setIsDraftSaving,
    setDraftId,
    addModule,
    removeModule,
    setModuleData: setModuleDataById,
    toggleShowMoreModules,
    resetEventForm,
  };
};
