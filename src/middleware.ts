import acceptLanguage from 'accept-language';
import { jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

import { fallbackLng, languages } from './app/i18n/settings';
import { auth } from './auth';
import { COOKIES } from './constants/cookies-key';
import { SECRET_ENV } from './constants/secret-env';
import { ROUTES } from './routes/client';

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
      !languages.some((loc) => nextUrl.pathname.startsWith(`/${loc}`)) &&
      !nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect(
        new URL(`/${lng}${nextUrl.pathname}`, req.url),
      );
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
        new URL(ROUTES.HOME.pathname, nextUrl.origin),
      );
    }
  }

  const res = NextResponse.next();

  const userId = req.cookies.get(COOKIES.USER_ID);

  if (!userId) {
    res.cookies.set(COOKIES.USER_ID, nanoid(), {
      maxAge: 3_153_600_000, // 100 years
    });
  }

  return res;
});
