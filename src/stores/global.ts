'use client';

import Pusher from 'pusher-js';
import { create } from 'zustand';

import {
  IS_CLIENT,
  LANGUAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
  PUBLIC_ENV,
} from '@/constants';
import { ROUTES } from '@/routes/client';
import { CustomError, isEnumValue } from '@/utils';

interface GlobalLoadingOptions {
  delay?: 0 | 100 | 200 | 300;
}

export enum MEDIA_QUERY_BREAK_POINT {
  xs = 480,
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1280,
}

type MEDIA_QUERY = keyof typeof MEDIA_QUERY_BREAK_POINT;

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

  mediaQuery: MEDIA_QUERY;
  mediaQueryBreakPoint: MEDIA_QUERY_BREAK_POINT;
  resetMediaQuery: () => void;

  sidePanelUrl: string;
  setSidePanelUrl: (url: string) => void;

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

  const getMediaQuery = () => {
    let mediaQuery: MEDIA_QUERY = 'xs';
    for (const [value, key] of Object.entries(MEDIA_QUERY_BREAK_POINT)) {
      const mediaQueryList = window.matchMedia(`(min-width: ${value}px)`);

      if (mediaQueryList.matches) {
        mediaQuery = key as MEDIA_QUERY;
      } else break;
    }

    return mediaQuery;
  };

  const mediaQuery = IS_CLIENT ? getMediaQuery() : 'xs';

  const sidePanelUrl = IS_CLIENT
    ? sessionStorage.getItem(SESSION_STORAGE.SIDE_PANEL_URL) ||
      ROUTES.FRIEND_LIST.pathname
    : ROUTES.FRIEND_LIST.pathname;

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

    mediaQuery,
    mediaQueryBreakPoint: MEDIA_QUERY_BREAK_POINT[mediaQuery],
    resetMediaQuery: () => {
      const mediaQueryKey = getMediaQuery();

      return set({
        mediaQuery: mediaQueryKey,
        mediaQueryBreakPoint: MEDIA_QUERY_BREAK_POINT[mediaQueryKey],
      });
    },

    //TODO 전역에서 사용할 필요가 없는값인것 같음 추후 로컬 상태값으로 변경 필요
    lastInviteLanguage,
    setLastInviteLanguage: (language) => {
      localStorage.setItem(LOCAL_STORAGE.LAST_INVITE_LANGUAGE, language);

      return set({ lastInviteLanguage: language });
    },

    sidePanelUrl,
    setSidePanelUrl: (url) => {
      sessionStorage.setItem(SESSION_STORAGE.SIDE_PANEL_URL, url);
      set({ sidePanelUrl: url });
    },

    pusher: new Pusher(PUBLIC_ENV.PUSHER_KEY, {
      cluster: PUBLIC_ENV.PUSHER_CLUSTER,
    }),
  };
});
