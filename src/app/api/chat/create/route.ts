import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { COOKIES } from '@/constants/cookies-key';
import { SECRET_ENV } from '@/constants/secret-env';
import type { ApiParams, ApiResponse } from '@/routes/api-type';
import { createApiRoute } from '@/utils/createApiRoute';
import { CustomError } from '@/utils/customError';

export const GET = createApiRoute(
  async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const cookies = req.cookies;

    const hostNickname = cookies.get(COOKIES.NICKNAME)?.value;

    if (!hostNickname)
      throw new CustomError({
        message: 'Nickname is not found',
        status: 400,
      });

    const params = Object.fromEntries(
      searchParams.entries(),
    ) as unknown as ApiParams.CREATE_CHAT;

    const jwt = await new SignJWT({
      hostId: params.userId,
      hostNickname,
      nickname: params.nickname,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(SECRET_ENV.AUTH_SECRET));

    return NextResponse.json({
      inviteToken: jwt,
    } satisfies ApiResponse.CREATE_CHAT);
  },
  {
    auth: true,
  },
);
