import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { SESSION_STORAGE } from '@/constants';
import { ROUTES } from '@/routes/client';
import {
  type NAVIGATION_ANIMATION,
  useGlobalModalStore,
  useGlobalStore,
  useHistoryStore,
} from '@/stores';
import { isCurrentHref } from '@/utils';
import { setExitNavigationAnimation } from '@/utils/client';

import { useCustomHref } from './useCustomHref';
import { useSidePanel } from './useSidePanel';

interface CustomNavigationOptions {
  withLoading?: boolean;
  withAnimation?: NAVIGATION_ANIMATION;
  toSidePanel?: boolean;
}

interface CustomRouter extends AppRouterInstance {
  push: (
    href: string | URL,
    options?: NavigateOptions & CustomNavigationOptions,
  ) => void;
  replace: (
    href: string | URL,
    options?: NavigateOptions & CustomNavigationOptions,
  ) => void;
  prefetch: (href: string | URL, options?: PrefetchOptions) => void;
  back: (options?: Omit<CustomNavigationOptions, 'toSidePanel'>) => void;
  forward: (options?: Omit<CustomNavigationOptions, 'toSidePanel'>) => void;
}

let memoizedCustomRouter: CustomRouter | undefined;

export const useCustomRouter = memoizedCustomRouter
  ? () => memoizedCustomRouter!
  : () => {
      const router = useRouter();
      const getCustomHref = useCustomHref();
      const setGlobalLoading = useGlobalStore(
        (state) => state.setGlobalLoading,
      );

      const sidePanel = useSidePanel();

      memoizedCustomRouter = useMemo(() => {
        const blockSameHref = (href: string) => {
          const isSameHref = isCurrentHref(href);

          if (isSameHref) {
            console.info('blocked by same href');
          }

          return isSameHref;
        };

        const replace: CustomRouter['replace'] = (href, options) => {
          const customHref = getCustomHref(href);

          const {
            withLoading,
            withAnimation = 'NONE',
            scroll,
            toSidePanel,
          } = options ?? {};

          if (toSidePanel)
            return sidePanel.push(customHref, {
              withAnimation,
            });

          if (blockSameHref(customHref)) return;

          sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

          if (withLoading) setGlobalLoading(true);

          setExitNavigationAnimation(withAnimation);

          return router.replace(customHref, {
            scroll,
          });
        };

        return {
          forward: (options) => {
            const { withLoading, withAnimation = 'FROM_BOTTOM' } =
              options ?? {};

            if (withLoading) setGlobalLoading(true);

            setExitNavigationAnimation(withAnimation);

            return router.forward();
          },
          refresh: router.refresh,
          back: (options) => {
            const { setIsBackNoticeModalOpen, backNoticeInfo } =
              useGlobalModalStore.getState();

            if (backNoticeInfo) return setIsBackNoticeModalOpen(true);

            const { withLoading, withAnimation = 'FROM_TOP' } = options ?? {};

            const { historyIndex } = useHistoryStore.getState();

            const hasBack = 0 < historyIndex;

            if (!hasBack)
              return replace(ROUTES.FRIEND_LIST.pathname, {
                withAnimation,
                withLoading,
              });

            if (withLoading) setGlobalLoading(true);

            setExitNavigationAnimation(withAnimation);

            return router.back();
          },
          push: (href, options) => {
            const customHref = getCustomHref(href);

            const {
              scroll,
              toSidePanel,
              withAnimation = 'FROM_BOTTOM',
              withLoading,
            } = options ?? {};

            if (toSidePanel)
              return sidePanel.push(customHref, {
                withAnimation,
              });

            if (blockSameHref(customHref)) return;

            if (withLoading) setGlobalLoading(true);

            setExitNavigationAnimation(withAnimation);

            return router.push(customHref, {
              scroll,
            });
          },
          replace,
          prefetch: (href, options) => {
            const customHref = getCustomHref(href);

            if (blockSameHref(customHref)) return;

            return router.prefetch(customHref, options);
          },
        };
      }, [getCustomHref, router, setGlobalLoading, sidePanel]);

      return memoizedCustomRouter;
    };
