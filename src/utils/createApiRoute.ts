import type { NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

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
        const authorization = req.headers.get('Authorization');

        if (!authorization)
          throw new CustomError({
            message: 'Authorization is not found',
            status: 401,
          });

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer')
          throw new CustomError({
            message: 'Invalid authorization type',
            status: 401,
          });

        try {
          await jwtVerify(
            token,
            new TextEncoder().encode(SECRET_ENV.AUTH_SECRET),
          );
        } catch {
          throw new CustomError({
            message: 'Invalid token',
            status: 401,
          });
        }
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
