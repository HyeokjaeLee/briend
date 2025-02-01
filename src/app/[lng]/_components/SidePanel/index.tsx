'use client';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useShallow } from 'zustand/shallow';

import { memo, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { CustomIconButton } from '@/components';
import { useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
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

  const route = findRoute(sidePanelUrl);

  const routeName = route.name;

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

  const { push } = useSidePanel();

  return (
    <aside
      className={cn(
        'hidden flex-1 bg-white sm:flex sm:flex-col',
        getNavigationAnimationClasses({
          animationType,
          navigationAnimation,
        }),
      )}
    >
      {route.topHeaderType === 'back' ? (
        <nav className="flex h-14 items-center justify-end px-5">
          <CustomIconButton
            size="3"
            variant="ghost"
            onClick={() => {
              push(ROUTES.FRIEND_LIST.pathname, { withAnimation: 'FROM_TOP' });
            }}
          >
            <RiCloseLine className="size-8 text-slate-900" />
          </CustomIconButton>
        </nav>
      ) : null}
      <section className="flex flex-1 flex-col overflow-auto">
        <ErrorBoundary
          errorComponent={(error) => <ErrorPage {...error} isSidePanel />}
        >
          <SideContents routeName={routeName} sidePanelUrl={sidePanelUrl} />
        </ErrorBoundary>
      </section>
    </aside>
  );
});

SidePanel.displayName = 'SidePanel';
