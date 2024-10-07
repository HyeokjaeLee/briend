import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { SECRET_ENV } from '@/constants/secret-env';

import { CustomError } from './customError';

type ApiRoute<TParams extends Record<string, string> | undefined, TResponse> = (
  req: NextRequest,
  context: {
    params: TParams;
  },
) => Promise<NextResponse<TResponse>>;

export const createApiRoute =
  <
    TParams extends Record<string, string> | undefined = undefined,
    TResponse = unknown,
  >(
    route: ApiRoute<TParams, TResponse>,
    options?: {
      auth: boolean;
    },
  ) =>
  async (req: NextRequest, context: { params: TParams }) => {
    try {
      if (options?.auth) {
        const token = await getToken({ req, secret: SECRET_ENV.AUTH_SECRET });

        if (!token)
          throw new CustomError({
            message: 'Unauthorized',
            status: 401,
          });
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
