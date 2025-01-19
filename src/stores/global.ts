'use client';

import Pusher from 'pusher-js';
import { create } from 'zustand';

import { IS_CLIENT, LANGUAGE, LOCAL_STORAGE, PUBLIC_ENV } from '@/constants';
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

export type NAVIGATION_ANIMATION =
  | 'FROM_LEFT'
  | 'FROM_RIGHT'
  | 'FROM_TOP'
  | 'FROM_BOTTOM'
  | 'NONE';

export type ANIMATION_TYPE = 'EXIT' | 'ENTER';

interface GlobalStore {
  isMounted: boolean;
  mount: () => void;

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
  hasSidePanel: boolean;
  resetMediaQuery: () => void;

  isErrorRoute: boolean;
  setIsErrorRoute: (isErrorRoute: boolean) => void;

  pusher: Pusher;

  animationType: ANIMATION_TYPE;
  setAnimationType: (animationType: ANIMATION_TYPE) => void;

  navigationAnimation: NAVIGATION_ANIMATION;
  setNavigationAnimation: (animation: NAVIGATION_ANIMATION) => void;
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

    if (IS_CLIENT) {
      for (const [value, key] of Object.entries(MEDIA_QUERY_BREAK_POINT)) {
        const mediaQueryList = window.matchMedia(`(min-width: ${value}px)`);

        if (mediaQueryList.matches) {
          mediaQuery = key as MEDIA_QUERY;
        } else break;
      }
    }

    const mediaQueryBreakPoint = MEDIA_QUERY_BREAK_POINT[mediaQuery];
    const hasSidePanel = MEDIA_QUERY_BREAK_POINT.sm <= mediaQueryBreakPoint;

    return { mediaQuery, mediaQueryBreakPoint, hasSidePanel };
  };

  return {
    isMounted: false,
    mount: () => set({ isMounted: true }),

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
    ...getMediaQuery(),
    resetMediaQuery: () => set(getMediaQuery()),

    //TODO 전역에서 사용할 필요가 없는값인것 같음 추후 로컬 상태값으로 변경 필요
    lastInviteLanguage,
    setLastInviteLanguage: (language) => {
      localStorage.setItem(LOCAL_STORAGE.LAST_INVITE_LANGUAGE, language);

      return set({ lastInviteLanguage: language });
    },

    isErrorRoute: false,
    setIsErrorRoute: (isErrorRoute) => set({ isErrorRoute }),

    pusher: new Pusher(PUBLIC_ENV.PUSHER_KEY, {
      cluster: PUBLIC_ENV.PUSHER_CLUSTER,
    }),

    animationType: 'ENTER',
    setAnimationType: (animationType) => set({ animationType }),

    navigationAnimation: 'NONE',
    setNavigationAnimation: (navigationAnimation) =>
      set({
        navigationAnimation,
      }),
  };
});
