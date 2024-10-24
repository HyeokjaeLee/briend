import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';

import { useMemo } from 'react';

import { SESSION_STORAGE } from '@/constants/storage-key';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores/global';
import { useHistoryStore } from '@/stores/history';
import { isCurrentHref } from '@/utils/isCurrentHref';

import { useCustomHref } from './useCustomHref';

interface CustomNavigation extends NavigateOptions {
  routingLoading?: boolean;
}
interface CustomRouter extends AppRouterInstance {
  push: (href: string | URL, options?: CustomNavigation) => void;
  replace: (href: string | URL, options?: CustomNavigation) => void;
  prefetch: (href: string | URL, options?: PrefetchOptions) => void;
}

export const useCustomRouter = () => {
  const router = useRouter();
  const getCustomHref = useCustomHref();

  return useMemo((): CustomRouter => {
    const { setIsLoading } = useGlobalStore.getState();

    return {
      ...router,
      back: () => {
        const { customHistory, historyIndex } = useHistoryStore.getState();

        const prevIndex = historyIndex - 1;

        const replaceToHome = () =>
          router.replace(ROUTES.CHATTING_LIST.pathname);

        if (prevIndex < 0) return replaceToHome();

        const currentHistory = customHistory.get(historyIndex);

        if (currentHistory === customHistory.get(prevIndex))
          return replaceToHome();

        return router.back();
      },
      push: (href, options) => {
        if (options?.routingLoading ?? true) setIsLoading(true);

        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        return router.push(customHref, options);
      },
      replace: (href, options) => {
        if (options?.routingLoading ?? true) setIsLoading(true);
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        sessionStorage.setItem(SESSION_STORAGE.REPLACED_MARK, 'true');

        return router.replace(customHref, options);
      },
      prefetch: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        return router.prefetch(customHref, options);
      },
    };
  }, [getCustomHref, router]);
};
