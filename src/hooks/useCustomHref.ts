import { useCallback } from 'react';

import { LANGUAGE, PUBLIC_ENV } from '@/constants';
import { isEnumValue } from '@/utils';

import { useLanguage } from './useLanguage';

/**
 * @returns i18n 언어 정보가 있으면 기본 href에 lng path를 추가한 값을 반환하는 함수
 */
export const useCustomHref = () => {
  const { lng: i18n } = useLanguage();

  const getCustomHref = useCallback(
    (href: string | URL) => {
      if (typeof href === 'string' && href.startsWith('?')) return href;

      const url =
        typeof href === 'string' ? new URL(href, PUBLIC_ENV.BASE_URL) : href;

      if (url.origin !== PUBLIC_ENV.BASE_URL) return url.href;

      let customHref = url.href.replace(PUBLIC_ENV.BASE_URL, '');
      const [, i18nPath] = customHref.split('/');

      const includedI18nPath = isEnumValue(LANGUAGE, i18nPath);

      //* ➕ 언어 쿠키가 있고, 현재 페이지가 언어 패스로 시작하지 않으면 언어 패스를 추가
      if (!includedI18nPath && i18n && !customHref.startsWith('?')) {
        const i18nPath = `/${i18n}`;

        if (!customHref.startsWith(i18nPath))
          customHref = i18nPath + customHref;

        //* 🔪 마지막에 /가 있으면 제거
        if (customHref.endsWith('/')) customHref = customHref.slice(0, -1);
      }

      return customHref;
    },
    [i18n],
  );

  return getCustomHref;
};
