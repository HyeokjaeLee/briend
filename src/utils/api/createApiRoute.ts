import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { CustomError, ERROR } from '../customError';

import { getAuthToken } from './getAuthToken';

type ApiRoute<
  TResponse,
  TContext extends Record<string, unknown> = Record<string, never>,
> = (
  req: NextRequest,
  context: {
    params: Promise<TContext>;
  },
) => Promise<NextResponse<TResponse>>;

export const createApiRoute =
  <TResponse, TContext extends Record<string, unknown> = Record<string, never>>(
    route: ApiRoute<TResponse, TContext>,
    options?: {
      auth: boolean;
    },
  ) =>
  async (req: NextRequest, context: { params: Promise<TContext> }) => {
    try {
      if (options?.auth) {
        const token = await getAuthToken({
          req,
        });

        if (!token) throw new CustomError(ERROR.UNAUTHORIZED());
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
