import { NextResponse } from 'next/server';

import { auth } from './configs/auth';
import { COOKIES } from './constants';
import { ROUTES } from './routes/client';
import type { RequestWithAuth } from './types/next-auth';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|manifest|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export const middleware = auth(async (req: RequestWithAuth) => {
  const { nextUrl, cookies, auth } = req;

  const originalUrl = req.nextUrl.href;
  const responseCallbackList: ((res: NextResponse) => void)[] = [];

  //* 🚦 access controller
  const accessSlug = nextUrl.pathname.split('/')[1];

  const isAuthenticated = !!auth?.user.id;

  console.log(isAuthenticated);

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
