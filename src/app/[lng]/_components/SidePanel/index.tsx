'use client';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { memo, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components';
import { SELECTOR } from '@/constants';
import { sidePanelContext, useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useSidePanelStore } from '@/stores';
import { assert, cn, findRoute } from '@/utils';
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

  const [pathname] = sidePanelUrl.split('?');

  assert(pathname);

  const route = findRoute(pathname);

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
        'bg-background hidden flex-1 sm:flex sm:flex-col',
        getNavigationAnimationClasses({
          animationType,
          navigationAnimation,
        }),
      )}
    >
      <sidePanelContext.Provider value={{ isSidePanel: true }}>
        {
          {
            none: null,
            back: (
              <nav className="flex h-14 items-center justify-end px-1">
                <Button
                  variant="ghost"
                  onlyIcon
                  onClick={() => {
                    push(ROUTES.FRIEND_LIST.pathname, {
                      withAnimation: 'FROM_TOP',
                    });
                  }}
                >
                  <RiCloseLine />
                </Button>
              </nav>
            ),
            empty: (
              <header
                id={SELECTOR.SIDE_TOP_HEADER}
                className="sticky top-0 h-fit w-full"
              />
            ),
            root: null,
          }[route.topHeaderType]
        }
        <section className="flex flex-1 flex-col overflow-auto">
          <ErrorBoundary errorComponent={(error) => <ErrorPage {...error} />}>
            <SideContents routeName={routeName} sidePanelUrl={sidePanelUrl} />
          </ErrorBoundary>
        </section>
      </sidePanelContext.Provider>
    </aside>
  );
};

export const SidePanel = memo(
  createOnlyClientComponent(SidePanelContainer, () => (
    <aside className="bg-background hidden flex-1 sm:flex sm:flex-col">
      <EmptyTemplate />
    </aside>
  )),
);
