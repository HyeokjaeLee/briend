import { NextRequest } from 'next/server';

import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';
import { auth } from './auth';
import { nanoid } from 'nanoid';
import { fallbackLng, languages } from './app/i18n/settings';
import { COOKIES } from './constants/cookies-key';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

acceptLanguage.languages(languages);

export const middleware = auth((req: NextRequest) => {
  //* 🌍 i18n redirect 🌍
  {
    let lng;
    const i18nCookie = req.cookies.get(COOKIES.I18N);

    if (i18nCookie) lng = acceptLanguage.get(i18nCookie.value);
    if (!lng)
      lng =
        acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng;

    if (
      !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !req.nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect(
        new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
      );
    }
  }

  const response = NextResponse.next();

  //* 🪪 유저 아이디 발급 🪪
  {
    const userId = req.cookies.get(COOKIES.USER_ID);

    if (!userId) {
      response.cookies.set(COOKIES.USER_ID, nanoid(), {
        expires: new Date('9999-12-31'),
      });
    }
  }

  return response;
});
