import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams, ApiResponse } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { getAuthToken } from '@/utils/api/getAuthToken';
import { CustomError, ERROR } from '@/utils/customError';

export const POST = createApiRoute<ApiResponse.CREATE_CHAT_INVITE_TOKEN>(
  async (req: NextRequest) => {
    const {
      guestNickname,
      language,
      userId,
    }: ApiParams.CREATE_CHAT_INVITE_TOKEN = await req.json();

    const token = await getAuthToken({ req });

    const hostNickname = token?.name;

    if (!hostNickname)
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['hostNickname']));

    const inviteToken = await new SignJWT({
      hostId: userId,
      hostNickname,
      guestNickname,
      language,
    } satisfies Payload.InviteToken)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));

    return NextResponse.json({
      inviteToken,
    });
  },
  {
    auth: true,
  },
);
