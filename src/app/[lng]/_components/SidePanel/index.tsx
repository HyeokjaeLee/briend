'use client';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useShallow } from 'zustand/shallow';

import { memo, useEffect } from 'react';

import { useSidePanelStore } from '@/stores';
import { cn, findRoute } from '@/utils';
import {
  getNavigationAnimationClasses,
  NAVIGATION_ANIMATION_DURATION,
} from '@/utils/client';

import ErrorPage from '../../error';

import { SideContents } from './_components/SideContents';
import { useInitRoute } from './_hooks/useInitRoute';

export const SidePanel = memo(() => {
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

  const routeName = findRoute(sidePanelUrl).name;

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
        'hidden flex-1 bg-white sm:flex sm:flex-col sm:overflow-auto',
        getNavigationAnimationClasses({
          animationType,
          navigationAnimation,
        }),
      )}
    >
      <ErrorBoundary
        errorComponent={(error) => <ErrorPage {...error} isSidePanel />}
      >
        <SideContents routeName={routeName} sidePanelUrl={sidePanelUrl} />
      </ErrorBoundary>
    </aside>
  );
});

SidePanel.displayName = 'SidePanel';
