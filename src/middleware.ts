import type { NextRequest } from 'next/server';

import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import { fallbackLng, languages, cookieName } from './app/i18n/settings';
import authConfig from './auth.config';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export const middleware = (req: NextRequest) => {
  let lng;
  const i18nCookie = req.cookies.get(cookieName);

  if (i18nCookie) lng = acceptLanguage.get(i18nCookie.value);
  if (!lng)
    lng = acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng;

  //* 우선순위에 따른 언어 페이지로 리다이렉트
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
    );
  }

  const refererCookie = req.cookies.get('referer');

  if (refererCookie) {
    const refererUrl = new URL(refererCookie.value);
    const lngInReferer = languages.find((lng) =>
      refererUrl.pathname.startsWith(`/${lng}`),
    );

    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);

    return response;
  }

  return NextResponse.next();
};
