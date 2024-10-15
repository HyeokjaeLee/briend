import { jwtVerify } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { PRIVATE_ENV } from '@/constants/private-env';
import { CustomError, ERROR } from '@/utils/customError';

export const checkAccessToken = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get('Authorization');

    if (!authorization) throw ERROR.UNAUTHORIZED('Authorization is not found');

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer')
      throw ERROR.UNAUTHORIZED('Invalid authorization type');

    await jwtVerify(token, new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));
  } catch (error) {
    const errorMessage =
      error instanceof CustomError ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );
  }
};
