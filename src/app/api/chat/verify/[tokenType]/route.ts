import { decodeJwt, errors } from 'jose';
import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/types/api';
import type { Payload, TOKEN_TYPE } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR } from '@/utils/customError';

type ChatTokenPayload = Payload.InviteToken | Payload.ChannelToken;

export const GET = createApiRoute<
  ApiResponse.VERIFY_CHAT_TOKEN<TOKEN_TYPE>,
  {
    tokenType: TOKEN_TYPE;
  }
>(async (req, { params }) => {
  const { searchParams } = req.nextUrl;

  const { tokenType } = await params;

  const token = searchParams.get('token');

  if (!token) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['token']));

  try {
    const { payload } = await jwtSecretVerify<ChatTokenPayload>(token);

    return NextResponse.json({
      isExpired: false,
      tokenType,
      payload,
    });
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
      const payload = decodeJwt<ChatTokenPayload>(token);

      return NextResponse.json({
        isExpired: true,
        tokenType,
        payload,
      });
    }

    throw e;
  }
});
