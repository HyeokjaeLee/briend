import type { NAVIGATION_ANIMATION } from '@/stores';
import { useGlobalStore } from '@/stores';

export const setExitNavigationAnimation = (
  withAnimation: NAVIGATION_ANIMATION,
) => {
  const { setAnimationType, setNavigationAnimation } =
    useGlobalStore.getState();

  setNavigationAnimation(withAnimation);

  setAnimationType(withAnimation === 'NONE' ? 'ENTER' : 'EXIT');
};
