import type { NextRequest, NextResponse } from 'next/server';

import { nanoid } from 'nanoid';

import { COOKIES } from '@/constants/cookies-key';

export const setUserIdCookie = (req: NextRequest, res: NextResponse) => {
  let userId = req.cookies.get(COOKIES.USER_ID)?.value;

  if (!userId) {
    userId = nanoid();
    res.cookies.set(COOKIES.USER_ID, userId, {
      maxAge: 3_153_600_000, // 100 years
    });
  }

  return userId;
};
