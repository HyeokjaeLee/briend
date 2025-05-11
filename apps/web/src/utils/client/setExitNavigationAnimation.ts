import type { NAVIGATION_ANIMATION } from '@/stores';
import { useGlobalStore, useSidePanelStore } from '@/stores';

export const setExitNavigationAnimation = (
  withAnimation: NAVIGATION_ANIMATION,
  sidePanel = false,
) => {
  const { setAnimationType, setNavigationAnimation } = sidePanel
    ? useSidePanelStore.getState()
    : useGlobalStore.getState();

  setNavigationAnimation(withAnimation);

  setAnimationType(withAnimation === 'NONE' ? 'ENTER' : 'EXIT');
};
