import acceptLanguage from 'accept-language';
import { type NextRequest, NextResponse } from 'next/server';

import { fallbackLng, languages } from './app/i18n/settings';
import { auth } from './auth';
import { COOKIES } from './constants/cookies-key';
import { setUserIdCookie } from './utils/api/setUserIdCookie';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

acceptLanguage.languages(languages);

export const middleware = auth(async (req: NextRequest) => {
  const { nextUrl } = req;

  //* 🌍 i18n redirect 🌍
  let lng;
  const i18nCookie = req.cookies.get(COOKIES.I18N);

  if (i18nCookie) lng = acceptLanguage.get(i18nCookie.value);
  if (!lng)
    lng = acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng;

  if (
    !languages.some((loc) => {
      const langPath = `/${loc}`;

      const { pathname } = nextUrl;

      return (
        pathname.startsWith(langPath + '/') ||
        //* root path
        nextUrl.pathname === langPath
      );
    }) &&
    !nextUrl.pathname.startsWith('/_next')
  ) {
    nextUrl.pathname = `/${lng}${nextUrl.pathname}`;

    return NextResponse.redirect(nextUrl);
  }
  const res = NextResponse.next();

  const purePath = nextUrl.pathname.replace(`/${lng}`, '');

  res.headers.set('pure-path', purePath);

  setUserIdCookie(req, res);

  return res;
});
