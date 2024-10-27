import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { useMemo } from 'react';

import { NAVIGATION_ANIMATION } from '@/constants/etc';
import { useGlobalStore } from '@/stores/global';
import { isCurrentHref } from '@/utils/isCurrentHref';

import { useCustomHref } from './useCustomHref';

interface CustomNavigation extends NavigateOptions {
  withLoading?: boolean;
  withAnimation?: NAVIGATION_ANIMATION;
}
interface CustomRouter extends AppRouterInstance {
  push: (href: string | URL, options?: CustomNavigation) => void;
  replace: (href: string | URL, options?: CustomNavigation) => void;
  prefetch: (href: string | URL, options?: PrefetchOptions) => void;
}

export const useCustomRouter = () => {
  const router = useRouter();
  const getCustomHref = useCustomHref();
  const [setIsLoading, setNavigationAnimation] = useGlobalStore(
    useShallow((state) => [state.setIsLoading, state.setNavigationAnimation]),
  );

  return useMemo(
    (): CustomRouter => ({
      forward: () => {
        return router.forward();
      },
      refresh: () => {
        return router.refresh();
      },
      back: () => {
        return router.back();
      },
      push: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        const withLoading = options?.withLoading ?? true;
        const withAnimation =
          options?.withAnimation ?? NAVIGATION_ANIMATION.FROM_LEFT;

        if (withLoading) setIsLoading(true);
        if (withAnimation) setNavigationAnimation(withAnimation);

        return router.push(customHref, options);
      },
      replace: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        const withLoading = options?.withLoading ?? true;
        const withAnimation =
          options?.withAnimation ?? NAVIGATION_ANIMATION.FROM_LEFT;

        if (withLoading) setIsLoading(true);
        if (withAnimation) setNavigationAnimation(withAnimation);

        return router.replace(customHref, options);
      },
      prefetch: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        return router.prefetch(customHref, options);
      },
    }),
    [getCustomHref, router, setIsLoading, setNavigationAnimation],
  );
};
