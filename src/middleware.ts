import type { JwtPayload } from './types/jwt';
import type { RequestWithAuth } from './types/next-auth';

import { decodeJwt } from 'jose';
import { NextResponse } from 'next/server';

import { fallbackLng, languages } from './app/i18n/settings';
import { auth } from './auth';
import { COOKIES, HEADERS } from './constants';
import { ROUTES } from './routes/client';
import { createId } from './utils';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export const middleware = auth(async (req: RequestWithAuth) => {
  const { nextUrl, cookies, auth } = req;

  const originalUrl = req.nextUrl.href;
  const responseCallbackList: ((res: NextResponse) => void)[] = [];

  const userId =
    auth?.user.id || cookies.get(COOKIES.USER_ID)?.value || createId();

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

  if (!lng)
    lng = i18nCookie || req.headers.get('Accept-Language') || fallbackLng;

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

  let isInvalidFirebaseToken = false;

  if (isAuthenticated) {
    const firebaseToken = cookies.get(COOKIES.FIREBASE_TOKEN)?.value;

    if (firebaseToken) {
      const { uid } = decodeJwt<JwtPayload.FirebaseToken>(firebaseToken);

      if (uid !== auth.user.id) {
        isInvalidFirebaseToken = true;
      }
    }
  } else isInvalidFirebaseToken = true;

  if (isInvalidFirebaseToken) {
    responseCallbackList.push((res) => {
      res.cookies.delete(COOKIES.FIREBASE_TOKEN);
    });
  }

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

  res.cookies.set(COOKIES.USER_ID, userId);

  responseCallbackList.forEach((callback) => callback(res));

  return res;
});
