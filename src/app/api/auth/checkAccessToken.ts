import { jwtVerify } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { SECRET_ENV } from '@/constants/secret-env';

export const checkAccessToken = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get('Authorization');

    if (!authorization) throw new Error('Authorization is not found');

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') throw new Error('Invalid authorization type');

    await jwtVerify(token, new TextEncoder().encode(SECRET_ENV.AUTH_SECRET));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.error();

    return NextResponse.json({
      error: errorMessage,
      status: 401,
    });
  }
};
