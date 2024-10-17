import { NextResponse, type NextRequest } from 'next/server';

import { COOKIES } from '@/constants/cookies-key';
import { prisma } from '@/prisma';
import type { ApiParams, ApiResponse } from '@/types/api';
import { createApiRoute } from '@/utils/createApiRoute';
import { ERROR } from '@/utils/customError';

export const POST = createApiRoute(
  async (req: NextRequest) => {
    const params: ApiParams.UNLINK_ACCOUNT = await req.json();

    const id = req.cookies.get(COOKIES.USER_ID)?.value;

    if (!id) throw ERROR.NOT_ENOUGH_PARAMS(['id']);

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