import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import type { SESSION_STORAGE_TYPE } from '@/constants/storage-key';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores/global';
import { useHistoryStore } from '@/stores/history';
import { isCurrentHref } from '@/utils/isCurrentHref';

import { useCustomHref } from './useCustomHref';

interface CustomNavigationOptions {
  withLoading?: boolean;
  withAnimation?: SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION;
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

let memoizedCustomRouter: CustomRouter;

export const useCustomRouter = () => {
  const router = useRouter();
  const getCustomHref = useCustomHref();
  const [setGlobalLoading, setSidePanelUrl] = useGlobalStore(
    useShallow((state) => [state.setGlobalLoading, state.setSidePanelUrl]),
  );

  if (memoizedCustomRouter) return memoizedCustomRouter;

  const replace: CustomRouter['replace'] = (href, options) => {
    const customHref = getCustomHref(href);

    if (isCurrentHref(customHref)) return;

    const {
      withLoading = true,
      withAnimation = 'NONE',
      scroll,
      toSidePanel,
    } = options ?? {};

    if (toSidePanel) return setSidePanelUrl(customHref);

    sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

    if (withLoading) setGlobalLoading(true);

    sessionStorage.setItem(SESSION_STORAGE.NAVIGATION_ANIMATION, withAnimation);

    return router.replace(customHref, {
      scroll,
    });
  };

  memoizedCustomRouter = {
    forward: (options) => {
      const { withLoading, withAnimation = 'FROM_BOTTOM' } = options ?? {};

      if (withLoading) setGlobalLoading(true);

      sessionStorage.setItem(
        SESSION_STORAGE.NAVIGATION_ANIMATION,
        withAnimation,
      );

      return router.forward();
    },
    refresh: router.refresh,
    back: (options) => {
      const { withLoading, withAnimation = 'FROM_TOP' } = options ?? {};

      const { historyIndex } = useHistoryStore.getState();

      const hasBack = 0 < historyIndex;

      if (!hasBack)
        return replace(ROUTES.HOME.pathname, {
          withAnimation,
          withLoading,
        });

      if (withLoading) setGlobalLoading(true);

      sessionStorage.setItem(
        SESSION_STORAGE.NAVIGATION_ANIMATION,
        withAnimation,
      );

      return router.back();
    },
    push: (href, options) => {
      const customHref = getCustomHref(href);

      if (isCurrentHref(customHref)) return;

      const {
        scroll,
        toSidePanel,
        withAnimation = 'FROM_BOTTOM',
        withLoading = true,
      } = options ?? {};

      if (toSidePanel) return setSidePanelUrl(customHref);

      if (withLoading) setGlobalLoading(true);

      sessionStorage.setItem(
        SESSION_STORAGE.NAVIGATION_ANIMATION,
        withAnimation,
      );

      return router.push(customHref, {
        scroll,
      });
    },
    replace,
    prefetch: (href, options) => {
      const customHref = getCustomHref(href);

      if (isCurrentHref(customHref)) return;

      return router.prefetch(customHref, options);
    },
  };

  return memoizedCustomRouter;
};
