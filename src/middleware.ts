import acceptLanguage from 'accept-language';
import { jwtVerify } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { fallbackLng, languages } from './app/i18n/settings';
import { auth } from './auth';
import { COOKIES } from './constants/cookies-key';
import { SECRET_ENV } from './constants/secret-env';
import { ROUTES } from './routes/client';
import { setUserIdCookie } from './utils/setUserIdCookie';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

acceptLanguage.languages(languages);

export const middleware = auth(async (req: NextRequest) => {
  const { nextUrl } = req;

  //* 🌍 i18n redirect 🌍
  {
    let lng;
    const i18nCookie = req.cookies.get(COOKIES.I18N);

    if (i18nCookie) lng = acceptLanguage.get(i18nCookie.value);
    if (!lng)
      lng =
        acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng;

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
  }

  //* 🔒 Access slug redirect 🔒
  {
    const accessSlug = nextUrl.pathname.split('/')[2];

    const isPrivateRoute = accessSlug === 'private';

    const accessToken = req.cookies.get(COOKIES.ACCESS_TOKEN);

    if (isPrivateRoute) {
      const unauthorizedError = new Error('Unauthorized');
      try {
        if (!accessToken) throw unauthorizedError;

        const secret = new TextEncoder().encode(SECRET_ENV.AUTH_SECRET);
        const { payload } = await jwtVerify(accessToken.value, secret);

        if (!('id' in payload)) throw unauthorizedError;
      } catch {
        const res = NextResponse.redirect(
          new URL(ROUTES.LOGIN.pathname, nextUrl.origin),
        );
        res.cookies.delete(COOKIES.ACCESS_TOKEN);
        res.cookies.set(COOKIES.PRIVATE_REFERER, nextUrl.href);

        return res;
      }
    }

    const isGuestRoute = accessSlug === 'guest';

    if (isGuestRoute && accessToken) {
      const privateReferer = req.cookies.get(COOKIES.PRIVATE_REFERER);

      if (privateReferer) {
        const res = NextResponse.redirect(privateReferer.value);

        res.cookies.delete(COOKIES.PRIVATE_REFERER);

        return res;
      }

      return NextResponse.redirect(
        new URL(ROUTES.CHATTING_LIST.pathname, nextUrl.origin),
      );
    }
  }

  const res = NextResponse.next();

  setUserIdCookie(req, res);

  return res;
});
