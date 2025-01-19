'use client';

import { useShallow } from 'zustand/shallow';

import { memo, useEffect } from 'react';

import { useSidePanelStore } from '@/stores';
import { cn, findRoute } from '@/utils';
import {
  getNavigationAnimationClasses,
  NAVIGATION_ANIMATION_DURATION,
} from '@/utils/client';

import { SideContents } from './_components/SideContents';
import { useInitRoute } from './_hooks/useInitRoute';

const SidePanel = () => {
  const [
    sidePanelUrl,
    navigationAnimation,
    setNavigationAnimation,
    animationType,
    setAnimationType,
  ] = useSidePanelStore(
    useShallow((state) => [
      state.sidePanelUrl,
      state.navigationAnimation,
      state.setNavigationAnimation,
      state.animationType,
      state.setAnimationType,
    ]),
  );

  const { name: routeName } = findRoute(sidePanelUrl);

  useInitRoute({ routeName });

  useEffect(() => {
    const { navigationAnimation } = useSidePanelStore.getState();

    if (navigationAnimation === 'NONE') return;

    setAnimationType('ENTER');

    const timer = setTimeout(() => {
      setNavigationAnimation('NONE');
    }, NAVIGATION_ANIMATION_DURATION.ENTER);

    return () => clearTimeout(timer);
  }, [setAnimationType, setNavigationAnimation, sidePanelUrl]);

  return (
    <aside
      className={cn(
        'hidden flex-1 bg-white sm:block',
        getNavigationAnimationClasses({
          animationType,
          navigationAnimation,
        }),
      )}
    >
      <SideContents routeName={routeName} sidePanelUrl={sidePanelUrl} />
    </aside>
  );
};

export default memo(SidePanel);
