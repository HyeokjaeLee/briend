import { NextResponse, type NextRequest } from 'next/server';

import { COOKIES } from '@/constants/cookies-key';
import type { ApiParams } from '@/types/api';
import { createApiRoute } from '@/utils/createApiRoute';
import { ERROR } from '@/utils/customError';

export const POST = createApiRoute(async (req: NextRequest) => {
  const params: ApiParams.EDIT_PROFILE = await req.json();

  const id = req.cookies.get(COOKIES.USER_ID)?.value;

  if (!id) throw ERROR.NOT_ENOUGH_PARAMS(['id']);

  return NextResponse.json({
    params,
  });
});
