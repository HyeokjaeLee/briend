'use client';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { memo, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components';
import { useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useSidePanelStore } from '@/stores';
import { cn, findRoute } from '@/utils';
import {
  createOnlyClientComponent,
  getNavigationAnimationClasses,
  NAVIGATION_ANIMATION_DURATION,
} from '@/utils/client';

import ErrorPage from '../../error';
import EmptyTemplate from './_components/Empty';
import { SideContents } from './_components/SideContents';
import { useInitRoute } from './_hooks/useInitRoute';

const SidePanelContainer = () => {
  const [
    sidePanelUrl,
    navigationAnimation,
    setNavigationAnimation,
    animationType,
    setAnimationType,
    setIsErrorRoute,
    setResetError,
  ] = useSidePanelStore(
    useShallow((state) => [
      state.sidePanelUrl,
      state.navigationAnimation,
      state.setNavigationAnimation,
      state.animationType,
      state.setAnimationType,
      state.setIsErrorRoute,
      state.setResetError,
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

  useEffect(() => {
    const { resetError } = useSidePanelStore.getState();

    resetError?.();
    setIsErrorRoute(false);
    setResetError(undefined);
  }, [setIsErrorRoute, setResetError, sidePanelUrl]);

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
      {routeName !== 'FRIEND_LIST' ? (
        <nav className="flex h-14 items-center justify-end px-1">
          <Button
            variant="ghost"
            onlyIcon
            onClick={() => {
              push(ROUTES.FRIEND_LIST.pathname, { withAnimation: 'FROM_TOP' });
            }}
          >
            <RiCloseLine />
          </Button>
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
};

export const SidePanel = memo(
  createOnlyClientComponent(SidePanelContainer, () => (
    <aside className="hidden flex-1 bg-white sm:flex sm:flex-col">
      <EmptyTemplate />
    </aside>
  )),
);
