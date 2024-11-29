import { type NextRequest, NextResponse } from 'next/server';

import { auth } from './auth';
import { setI18nNextResponse } from './middleware/setI18nNextResponse';
import { setUserIdCookie } from './middleware/setUserIdCookie';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export const middleware = auth(async (req: NextRequest) => {
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith('/_next')) return NextResponse.next();

  const res = setI18nNextResponse(req);

  await setUserIdCookie(req, res);

  return res;
});
