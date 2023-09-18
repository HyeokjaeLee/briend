import { createWithEqualityFn } from 'zustand/traditional';

import { LANGUAGE } from '@/constants';

import type Pusher from 'pusher-js';

interface GlobalStore {
  globalMenuOpened: boolean;
  setGlobalMenuOpened: (menuOpened: boolean) => void;

  deviceLanguage: LANGUAGE;
  setDeviceLanguage: (language: LANGUAGE) => void;

  pusher?: Pusher;
  setPusher: (pusher: Pusher) => void;
}

export const useGlobalStore = createWithEqualityFn<GlobalStore>(
  (set) => ({
    globalMenuOpened: false,
    setGlobalMenuOpened: (globalMenuOpened) => set({ globalMenuOpened }),

    deviceLanguage: LANGUAGE.KOREAN,
    setDeviceLanguage: (deviceLanguage) => set({ deviceLanguage }),

    setPusher: (pusher) => set({ pusher }),
  }),
  Object.is,
);
