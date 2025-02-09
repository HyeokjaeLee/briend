import type { ANIMATION_TYPE, NAVIGATION_ANIMATION } from './global';

import { create } from 'zustand';

import { SESSION_STORAGE } from '@/constants';
import { ROUTES } from '@/routes/client';

interface SidePanelStore {
  sidePanelUrl: string;
  setSidePanelUrl: (sidePanelUrl: string) => void;

  animationType: ANIMATION_TYPE;
  setAnimationType: (animationType: ANIMATION_TYPE) => void;

  navigationAnimation: NAVIGATION_ANIMATION;
  setNavigationAnimation: (animation: NAVIGATION_ANIMATION) => void;

  isErrorRoute: boolean;
  setIsErrorRoute: (isErrorRouter: boolean) => void;

  resetError?: () => void;
  setResetError: (resetError: (() => void) | undefined) => void;
}

export const useSidePanelStore = create<SidePanelStore>((set) => {
  return {
    sidePanelUrl: ROUTES.FRIEND_LIST.pathname,
    setSidePanelUrl: (sidePanelUrl) => {
      sessionStorage.setItem(SESSION_STORAGE.SIDE_PANEL_URL, sidePanelUrl);
      set({ sidePanelUrl });
    },

    animationType: 'ENTER',
    setAnimationType: (animationType) => set({ animationType }),

    navigationAnimation: 'NONE',
    setNavigationAnimation: (animation) =>
      set({ navigationAnimation: animation }),

    isErrorRoute: false,
    setIsErrorRoute: (isErrorRoute) => set({ isErrorRoute }),

    setResetError: (resetError) => set({ resetError }),
  };
});
