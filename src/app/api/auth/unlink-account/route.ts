import { NextResponse, type NextRequest } from 'next/server';

import { COOKIES } from '@/constants';
import { prisma } from '@/prisma';
import type { ApiParams } from '@/types/api-params';
import type { ApiResponse } from '@/types/api-response';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { CustomError, ERROR } from '@/utils/customError';

export const POST = createApiRoute(
  async (req: NextRequest) => {
    const params: ApiParams.UNLINK_ACCOUNT = await req.json();

    const id = req.cookies.get(COOKIES.USER_ID)?.value;

    if (!id) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['id']));

    const providerIdKey = `${params.provider}_id` as const;

    await prisma.users.update({
      where: { id },
      data: {
        [providerIdKey]: null,
      },
    });

    return NextResponse.json({
      unlinkedProvider: params.provider,
    } satisfies ApiResponse.UNLINK_ACCOUNT);
  },
  {
    auth: true,
  },
);
