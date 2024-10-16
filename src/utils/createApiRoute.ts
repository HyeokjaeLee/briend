import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { PRIVATE_ENV } from '@/constants/private-env';

import { CustomError, ERROR } from './customError';

type ApiRoute<TResponse> = (
  req: NextRequest,
  //! context: Promise<TContext>, RC 버전에서 api 라우트 두번째 파라미터에 대한 빌드 타입에러가 발생함
) => Promise<NextResponse<TResponse>>;

export const createApiRoute =
  <TResponse>(
    route: ApiRoute<TResponse>,
    options?: {
      auth: boolean;
    },
  ) =>
  async (req: NextRequest) => {
    try {
      if (options?.auth) {
        const token = await getToken({ req, secret: PRIVATE_ENV.AUTH_SECRET });

        if (!token) throw ERROR.UNAUTHORIZED();
      }

      const res = await route(req);

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
