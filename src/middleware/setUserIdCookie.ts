import type { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { COOKIES } from '@/constants';
import { createId } from '@/utils';

export const setUserIdCookie = async (req: NextRequest, res: NextResponse) => {
  let cookieUserId = req.cookies.get(COOKIES.USER_ID)?.value;

  //TODO: 기존 nanoid만을 사용한 쿠키 아이디 제거 후 쿠키 아이디 생성 로직 추가
  if (cookieUserId?.includes('_')) cookieUserId = undefined;

  const sessionUserId = await auth().then((session) => session?.user.id);

  if (!cookieUserId || (sessionUserId && sessionUserId !== cookieUserId)) {
    res.cookies.set(COOKIES.USER_ID, sessionUserId || createId());
  }

  return res;
};
