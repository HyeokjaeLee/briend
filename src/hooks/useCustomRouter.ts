import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import { useMemo } from 'react';

import { COOKIES } from '@/constants/cookies-key';
import { SESSION } from '@/constants/storage-key';

export const useCustomRouter = () => {
  const router = useRouter();

  const customRouter = useMemo(() => {
    const getCustomHref = (href: string) => {
      let customHref = href;

      const i18n = getCookie(COOKIES.I18N);

      if (i18n && !customHref.startsWith('?')) {
        const i18nPath = `/${i18n}`;

        if (!customHref.startsWith(i18nPath))
          customHref = i18nPath + customHref;

        if (customHref.endsWith('/')) customHref = customHref.slice(0, -1);
      }

      return new URL(customHref, location.origin).toString() === location.href
        ? null
        : customHref;
    };

    const push: typeof router.push = (href, options) => {
      const customHref = getCustomHref(href);

      if (!customHref) return;

      return router.push(customHref, options);
    };

    const replace: typeof router.replace = (href, options) => {
      const customHref = getCustomHref(href);

      if (!customHref) return;

      if ('index' in history.state) {
        sessionStorage.setItem(
          SESSION.REPLACED_HISTORY_INDEX,
          String(history.state.index),
        );
      } else {
        sessionStorage.removeItem(SESSION.HISTORY_INDEX);
      }

      return router.replace(customHref, options);
    };

    return {
      ...router,
      push,
      replace,
    };
  }, [router]);

  return customRouter;
};
