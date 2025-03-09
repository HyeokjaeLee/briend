'use client';

import { create } from 'zustand';

import { IS_CLIENT } from '@/constants';

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
  globalLoading: {
    value: boolean;
    options?: GlobalLoadingOptions;
  };
  setGlobalLoading: (
    isLoading: boolean,
    options?: GlobalLoadingOptions,
  ) => void;

  isTouchDevice: boolean;
  resetIsTouchDevice: () => boolean;

  mediaQuery: MEDIA_QUERY;
  mediaQueryBreakPoint: MEDIA_QUERY_BREAK_POINT;
  hasSidePanel: boolean;
  resetMediaQuery: () => void;

  isErrorRoute: boolean;
  setIsErrorRoute: (isErrorRoute: boolean) => void;

  animationType: ANIMATION_TYPE;
  setAnimationType: (animationType: ANIMATION_TYPE) => void;

  navigationAnimation: NAVIGATION_ANIMATION;
  setNavigationAnimation: (animation: NAVIGATION_ANIMATION) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => {
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

  const getIsTouchDevice = () => {
    if (IS_CLIENT) {
      return 'ontouchstart' in window || 0 < navigator.maxTouchPoints;
    }

    return true;
  };

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

    isTouchDevice: false,
    resetIsTouchDevice: () => {
      const isTouchDevice = getIsTouchDevice();

      set({ isTouchDevice });

      return isTouchDevice;
    },

    ...getMediaQuery(),
    resetMediaQuery: () => set(getMediaQuery()),

    isErrorRoute: false,
    setIsErrorRoute: (isErrorRoute) => set({ isErrorRoute }),

    animationType: 'ENTER',
    setAnimationType: (animationType) => set({ animationType }),

    navigationAnimation: 'NONE',
    setNavigationAnimation: (navigationAnimation) =>
      set({
        navigationAnimation,
      }),
  };
});
