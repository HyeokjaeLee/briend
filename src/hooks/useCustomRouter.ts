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
  onlyIntercept?: boolean;
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
  back: (options?: Omit<CustomNavigationOptions, 'onlyIntercept'>) => void;
  forward: (options?: Omit<CustomNavigationOptions, 'onlyIntercept'>) => void;
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

      let {
        withLoading: isLoading = true,
        withAnimation: animationType,
        scroll,
      } = options ?? {};

      if (options?.onlyIntercept) {
        animationType ??= 'NONE';
        sessionStorage.setItem(SESSION_STORAGE.ONLY_INTERCEPT, location.href);
        isLoading = false;
        scroll = false;
      }

      if (isLoading) setGlobalLoading(true);
      if (animationType)
        sessionStorage.setItem(
          SESSION_STORAGE.NAVIGATION_ANIMATION,
          animationType,
        );

      return router.replace(customHref, {
        scroll,
      });
    };

    return {
      forward: (options) => {
        const withLoading = options?.withLoading;
        const animationType = options?.withAnimation ?? 'FROM_BOTTOM';

        if (withLoading) setGlobalLoading(true);
        if (animationType)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            animationType,
          );

        return router.forward();
      },
      refresh: () => {
        return router.refresh();
      },
      back: (options) => {
        const withLoading = options?.withLoading;
        const animationType = options?.withAnimation;
        const { historyIndex } = useHistoryStore.getState();

        const hasBack = 0 < historyIndex;

        if (!hasBack)
          return replace(ROUTES.HOME.pathname, {
            withAnimation: animationType,
            withLoading,
          });

        if (withLoading) setGlobalLoading(true);
        if (animationType)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            animationType,
          );

        return router.back();
      },
      push: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        if (options?.onlyIntercept) {
          return replace(customHref, options);
        }

        const withLoading = options?.withLoading ?? true;
        const animationType = options?.withAnimation;

        if (withLoading) setGlobalLoading(true);
        if (animationType)
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            animationType,
          );

        return router.push(customHref, {
          scroll: options?.scroll,
        });
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
