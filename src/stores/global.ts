'use client';

import Pusher from 'pusher-js';
import { create } from 'zustand';

import { IS_CLIENT } from '@/constants/etc';
import { LANGUAGE } from '@/constants/language';
import { PUBLIC_ENV } from '@/constants/public-env';
import { LOCAL_STORAGE } from '@/constants/storage-key';
import { CustomError } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';

interface GlobalLoadingOptions {
  delay?: 0 | 100 | 200 | 300;
}

interface GlobalStore {
  globalLoading: {
    value: boolean;
    options?: GlobalLoadingOptions;
  };
  setGlobalLoading: (
    isLoading: boolean,
    options?: GlobalLoadingOptions,
  ) => void;

  lastInviteLanguage: LANGUAGE;
  setLastInviteLanguage: (language: LANGUAGE) => void;

  pusher: Pusher;
}

export const useGlobalStore = create<GlobalStore>((set) => {
  const lastInviteLanguage =
    (IS_CLIENT && localStorage.getItem(LOCAL_STORAGE.LAST_INVITE_LANGUAGE)) ||
    LANGUAGE.ENGLISH;

  if (!isEnumValue(LANGUAGE, lastInviteLanguage)) {
    localStorage.removeItem(LOCAL_STORAGE.LAST_INVITE_LANGUAGE);

    throw new CustomError();
  }

  return {
    globalLoading: {
      value: false,
    },
    setGlobalLoading: (isLoading, options) =>
      set({
        globalLoading: {
          value: isLoading,
          options,
        },
      }),

    lastInviteLanguage,
    setLastInviteLanguage: (language) => {
      localStorage.setItem(LOCAL_STORAGE.LAST_INVITE_LANGUAGE, language);

      return set({ lastInviteLanguage: language });
    },

    pusher: new Pusher(PUBLIC_ENV.PUSHER_KEY, {
      cluster: PUBLIC_ENV.PUSHER_CLUSTER,
    }),
  };
});
