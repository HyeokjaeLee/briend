import type {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';

import { useMemo } from 'react';

import { SESSION } from '@/constants/storage-key';
import { isCurrentHref } from '@/utils/isCurrentHref';

import { useCustomHref } from './useCustomHref';

interface CustomRouter extends AppRouterInstance {
  push: (href: string | URL, options?: NavigateOptions) => void;
  replace: (href: string | URL, options?: NavigateOptions) => void;
  prefetch: (href: string | URL, options?: PrefetchOptions) => void;
}

export const useCustomRouter = () => {
  const router = useRouter();
  const getCustomHref = useCustomHref();

  return useMemo((): CustomRouter => {
    return {
      ...router,
      push: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        return router.push(customHref, options);
      },
      replace: (href, options) => {
        const customHref = getCustomHref(href);

        if (isCurrentHref(customHref)) return;

        sessionStorage.setItem(SESSION.REPLACED_MARK, 'true');

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
