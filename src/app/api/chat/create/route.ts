import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams, ApiResponse } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/createApiRoute';
import { ERROR } from '@/utils/customError';

export const GET = createApiRoute(
  async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const token = await getToken({ req, secret: PRIVATE_ENV.AUTH_SECRET });

    const hostNickname = token?.name;

    if (!hostNickname) throw ERROR.NOT_ENOUGH_PARAMS(['hostNickname']);

    const params = Object.fromEntries(
      searchParams.entries(),
    ) as unknown as ApiParams.CREATE_CHAT;

    const inviteToken = await new SignJWT({
      hostId: params.userId,
      hostNickname,
      nickname: params.nickname,
      language: params.language,
    } satisfies Payload.InviteToken)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));

    return NextResponse.json({
      inviteToken,
    } satisfies ApiResponse.CREATE_CHAT);
  },
  {
    auth: true,
  },
);
