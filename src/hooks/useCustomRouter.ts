import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';

import { useMemo } from 'react';

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
  back: (options?: CustomNavigationOptions) => void;
  forward: (options?: CustomNavigationOptions) => void;
}

export const useCustomRouter = () => {
  const router = useRouter();
  const getCustomHref = useCustomHref();
  const setGlobalLoading = useGlobalStore((state) => state.setGlobalLoading);

  return useMemo((): CustomRouter => {
    const replace: CustomRouter['replace'] = (href, options) => {
      const customHref = getCustomHref(href);

      if (isCurrentHref(customHref)) return;

      sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

      const withLoading = options?.withLoading ?? true;
      const withAnimation = options?.withAnimation;

      if (withLoading) setGlobalLoading(true);
      if (withAnimation)
        sessionStorage.setItem(
          SESSION_STORAGE.NAVIGATION_ANIMATION,
          withAnimation,
        );

      return router.replace(customHref, options);
    };

    return {
      forward: (options) => {
        const withLoading = options?.withLoading;
        const withAnimation = options?.withAnimation ?? 'FR';

        if (withLoading) setGlobalLoading(true);
        if (withAnimation)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            withAnimation,
          );

        return router.forward();
      },
      refresh: () => {
        return router.refresh();
      },
      back: (options) => {
        const withLoading = options?.withLoading;
        const withAnimation = options?.withAnimation;
        const { historyIndex } = useHistoryStore.getState();

        const hasBack = 0 < historyIndex;

        if (!hasBack)
          return replace(ROUTES.HOME.pathname, {
            withAnimation,
            withLoading,
          });

        if (withLoading) setGlobalLoading(true);
        if (withAnimation)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            withAnimation,
          );

        return router.back();
      },
      push: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        const withLoading = options?.withLoading ?? true;
        const withAnimation = options?.withAnimation;

        if (withLoading) setGlobalLoading(true);
        if (withAnimation)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            withAnimation,
          );

        return router.push(customHref, options);
      },
      replace,
      prefetch: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        return router.prefetch(customHref, options);
      },
    };
  }, [getCustomHref, router, setGlobalLoading]);
};
