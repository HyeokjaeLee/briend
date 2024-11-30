import type { NextRequest } from 'next/server';

import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';

import { fallbackLng, languages } from '../app/i18n/settings';

enum COOKIES {
  I18N = 'I18N',
  USER_ID = 'USER_ID',
  PRIVATE_REFERER = 'PRIVATE_REFERER',
  PROVIDER_TO_CONNECT = 'PROVIDER_TO_CONNECT',
}

export const setI18nNextResponse = (req: NextRequest) => {
  let lng: string | undefined;
  let hasLngPath = false;
  const { nextUrl } = req;

  const i18nCookieValue = req.cookies.get(COOKIES.I18N)?.value;

  for (const language of languages) {
    const langPath = `/${language}`;

    if (
      nextUrl.pathname.startsWith(langPath + '/') ||
      nextUrl.pathname === langPath
    ) {
      lng = language;
      hasLngPath = true;

      break;
    }
  }

  if (!lng)
    lng =
      i18nCookieValue ||
      acceptLanguage.get(req.headers.get('Accept-Language')) ||
      fallbackLng;

  let res = NextResponse.next();

  if (!hasLngPath) {
    nextUrl.pathname = `/${lng}${nextUrl.pathname}`;

    res = NextResponse.redirect(nextUrl);
  }

  if (nextUrl.pathname.startsWith(`/${lng}`)) {
    const purePath = nextUrl.pathname.replace(`/${lng}`, '');

    res.headers.set('pure-path', purePath);
  }

  if (lng !== i18nCookieValue) {
    res.cookies.set(COOKIES.I18N, lng, {
      httpOnly: true,
    });
  }

  return res;
};
