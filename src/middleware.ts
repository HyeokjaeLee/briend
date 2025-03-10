import { NextResponse } from 'next/server';

import { auth } from './configs/auth';
import { fallbackLng, languages } from './configs/i18n/settings';
import { COOKIES, HEADERS, LANGUAGE } from './constants';
import { ROUTES } from './routes/client';
import type { RequestWithAuth } from './types/next-auth';
import { isEnumValue } from './utils';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|manifest|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export const middleware = auth(async (req: RequestWithAuth) => {
  const { nextUrl, cookies, auth } = req;

  const originalUrl = req.nextUrl.href;
  const responseCallbackList: ((res: NextResponse) => void)[] = [];

  //* 🌍 i18n
  let lng: string | undefined;
  let hasLngPath = false;
  const i18nCookie = cookies.get(COOKIES.I18N)?.value;

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

  if (!lng) {
    const acceptLanguage = req.headers.get('Accept-Language');

    const i18nFromAcceptLanguage = acceptLanguage?.split(',')[0];

    lng = auth?.user.language || i18nCookie || i18nFromAcceptLanguage;

    if (!isEnumValue(LANGUAGE, lng)) {
      lng = fallbackLng;
    }
  }

  if (!hasLngPath) {
    nextUrl.pathname = `/${lng}${nextUrl.pathname}`;
    hasLngPath = true;
  }

  if (hasLngPath) {
    const purePath = nextUrl.pathname.replace(`/${lng}`, '');

    responseCallbackList.push((res) => {
      res.headers.set(HEADERS.PURE_PATH, purePath);
    });
  }

  if (lng !== i18nCookie) {
    responseCallbackList.push((res) => {
      res.cookies.set(COOKIES.I18N, lng, {
        httpOnly: true,
      });
    });
  }

  //* 🚦 access controller
  const accessSlug = nextUrl.pathname.split('/')[2];

  const isAuthenticated = !!auth?.user.id;

  switch (accessSlug) {
    case 'private':
      if (!isAuthenticated) {
        responseCallbackList.push((res) => {
          res.cookies.set(COOKIES.PRIVATE_REFERER, originalUrl);
        });

        nextUrl.pathname = ROUTES.LOGIN.pathname;
        nextUrl.search = '';
      }
      break;
    case 'guest':
      if (isAuthenticated) {
        const privateReferer = cookies.get(COOKIES.PRIVATE_REFERER)?.value;

        if (privateReferer) {
          const privateRefererUrl = new URL(privateReferer);

          nextUrl.pathname = privateRefererUrl.pathname;
          nextUrl.search = privateRefererUrl.search;

          responseCallbackList.push((res) => {
            res.cookies.delete(COOKIES.PRIVATE_REFERER);
          });
        } else {
          nextUrl.pathname = ROUTES.FRIEND_LIST.pathname;
          nextUrl.search = '';
        }
      }
      break;
  }

  //* 🚀 response callback
  const isRedirect = originalUrl !== nextUrl.href;

  const res = isRedirect ? NextResponse.redirect(nextUrl) : NextResponse.next();

  responseCallbackList.forEach((callback) => callback(res));

  return res;
});
