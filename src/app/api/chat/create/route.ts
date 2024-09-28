import { type NextRequest, NextResponse } from 'next/server';

import { SECRET_ENV } from '@/constants/secret-env';

import { checkAccessToken } from '../../auth/checkAccessToken';

export const GET = async (req: NextRequest) => {
  const unauthenticatedRes = await checkAccessToken(req);

  if (unauthenticatedRes) return unauthenticatedRes;

  return NextResponse.json({ test: 1 });
};
