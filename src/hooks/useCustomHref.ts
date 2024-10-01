import { usePathname } from 'next/navigation';

import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { isEnumValue } from '@/utils/isEnumValue';

export const useCustomHref = () => {
  const [{ i18next }] = useCookies([COOKIES.I18N]);
  const pathname = usePathname();

  let i18n: string = i18next;

  const [, i18nPath] = pathname.split('/');

  if (isEnumValue(LANGUAGE, i18nPath)) {
    i18n = i18nPath;
  }

  const getCustomHref = useCallback(
    (href: string | URL) => {
      if (typeof href === 'string' && href.startsWith('?')) return href;

      const url =
        typeof href === 'string' ? new URL(href, location.origin) : href;

      if (url.origin !== location.origin) return url.href;

      let customHref = url.href.replace(location.origin, '');

      //* 언어 쿠키가 있고, 현재 페이지가 언어 패스로 시작하지 않으면 언어 패스를 추가
      if (i18n && !customHref.startsWith('?')) {
        const i18nPath = `/${i18n}`;

        if (!customHref.startsWith(i18nPath))
          customHref = i18nPath + customHref;

        if (customHref.endsWith('/')) customHref = customHref.slice(0, -1);
      }

      return customHref;
    },
    [i18n],
  );

  return getCustomHref;
};
