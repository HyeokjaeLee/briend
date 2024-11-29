import type { NextRequest, NextResponse } from 'next/server';

import { nanoid } from 'nanoid';

import { auth } from '@/auth';
import { COOKIES } from '@/stores/cookies';

export const setUserIdCookie = async (req: NextRequest, res: NextResponse) => {
  const cookieUserId = req.cookies.get(COOKIES.USER_ID)?.value;

  const sessionUserId = await auth().then((session) => session?.user.id);

  if (!cookieUserId || (sessionUserId && sessionUserId !== cookieUserId)) {
    res.cookies.set(COOKIES.USER_ID, sessionUserId || nanoid());
  }

  return res;
};
