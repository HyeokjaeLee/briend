import acceptLanguage from 'accept-language';
import { verify } from 'jsonwebtoken';
import { type NextRequest, NextResponse } from 'next/server';

import { fallbackLng, languages } from './app/i18n/settings';
import { auth } from './auth';
import { COOKIES } from './constants/cookies-key';
import { SECRET_ENV } from './constants/secret-env';

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
    const accessToken = req.cookies.get(COOKIES.ACCESS_TOKEN);

    if (accessToken) {
      const user = verify(accessToken.value, SECRET_ENV.AUTH_SECRET);
    }
  }

  return response;
});
