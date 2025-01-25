import type { NextResponse } from 'next/server';

import { COOKIES } from '@/constants';
import type { RequestWithAuth } from '@/types/next-auth';
import { createId } from '@/utils';

export const setUserIdCookie = async (
  req: RequestWithAuth,
  res: NextResponse,
) => {
  const cookieUserId = req.cookies.get(COOKIES.USER_ID)?.value;

  const sessionUserId = req.auth?.user.id;

  if (!cookieUserId || (sessionUserId && sessionUserId !== cookieUserId)) {
    res.cookies.set(COOKIES.USER_ID, sessionUserId || createId());
  }

  return res;
};
