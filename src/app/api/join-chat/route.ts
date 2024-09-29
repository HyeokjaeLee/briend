import type { InviteTokenPayload } from '../chat/create/route';
import type { NextRequest } from 'next/server';

import { errors, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

import { SECRET_ENV } from '@/constants/secret-env';
import { createApiRoute } from '@/utils/createApiRoute';

export const GET = createApiRoute(async (req: NextRequest) => {
  const inviteToken = req.nextUrl.searchParams.get('inviteToken');

  try {
    const { payload } = await jwtVerify<InviteTokenPayload>(
      inviteToken,
      new TextEncoder().encode(SECRET_ENV.AUTH_SECRET),
    );
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
    }
  }

  //! 쿠키에 담아서 리다이렉트

  return NextResponse.json({
    test: 1,
  });
});
