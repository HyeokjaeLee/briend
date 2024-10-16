import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { PRIVATE_ENV } from '@/constants/private-env';

import { CustomError, ERROR } from './customError';

type ApiRoute<TContext, TResponse> = (
  req: NextRequest,
  context: Promise<TContext>,
) => Promise<NextResponse<TResponse>>;

export const createApiRoute =
  <TContext, TResponse>(
    route: ApiRoute<TContext, TResponse>,
    options?: {
      auth: boolean;
    },
  ) =>
  async (req: NextRequest, context: Promise<TContext>) => {
    try {
      if (options?.auth) {
        const token = await getToken({ req, secret: PRIVATE_ENV.AUTH_SECRET });

        if (!token) throw ERROR.UNAUTHORIZED();
      }

      const res = await route(req, context);

      return res;
    } catch (e) {
      if (e instanceof CustomError)
        return NextResponse.json(
          {
            error: e.stack,
          },
          {
            status: e.status,
            statusText: e.message,
          },
        );

      if (e instanceof Error)
        return NextResponse.json(
          {
            error: e.stack,
          },
          {
            status: 500,
            statusText: e.message,
          },
        );

      return NextResponse.error();
    }
  };
