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

export enum MEDIA_QUERY {
  xs = 480,
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1280,
}

type MEDIA_QUERY_KEY = keyof typeof MEDIA_QUERY;

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

  mediaQueryKey: MEDIA_QUERY_KEY;
  mediaQuery: MEDIA_QUERY;
  resetMediaQuery: () => void;

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

  const findMediaQueryKey = () => {
    let mediaQueryKey: MEDIA_QUERY_KEY = 'xs';
    for (const [value, key] of Object.entries(MEDIA_QUERY)) {
      const mediaQueryList = window.matchMedia(`(min-width: ${value}px)`);

      if (mediaQueryList.matches) {
        mediaQueryKey = key as MEDIA_QUERY_KEY;
      } else break;
    }

    return mediaQueryKey;
  };

  const mediaQueryKey = IS_CLIENT ? findMediaQueryKey() : 'xs';

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

    mediaQueryKey,
    mediaQuery: MEDIA_QUERY[mediaQueryKey],
    resetMediaQuery: () => {
      const mediaQueryKey = findMediaQueryKey();

      return set({ mediaQueryKey, mediaQuery: MEDIA_QUERY[mediaQueryKey] });
    },

    //TODO 전역에서 사용할 필요가 없는값인것 같음 추후 로컬 상태값으로 변경 필요
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
