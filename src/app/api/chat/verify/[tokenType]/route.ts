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

  const inviteToken = searchParams.get('inviteToken');

  if (!inviteToken)
    throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['inviteToken']));

  try {
    const { payload } = await jwtSecretVerify<ChatTokenPayload>(inviteToken);

    return NextResponse.json({
      isExpired: false,
      tokenType,
      payload,
    });
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
      const payload = decodeJwt<ChatTokenPayload>(inviteToken);

      return NextResponse.json({
        isExpired: true,
        tokenType,
        payload,
      });
    }

    throw e;
  }
});
