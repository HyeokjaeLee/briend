import { NextResponse } from 'next/server';

import { auth } from '@/configs/auth';
import { adminAuth } from '@/database/firebase/server';
import { createApiRoute } from '@/utils/api';

export interface GetFirebaseCustomTokenResponse {
  isLogin: boolean;
  customToken: string;
}

export const GET = createApiRoute<GetFirebaseCustomTokenResponse>(async () => {
  const session = await auth();

  let customToken = '';

  if (session) {
    customToken = await adminAuth.createCustomToken(session.user.id);
  }

  return NextResponse.json({
    isLogin: !!session,
    customToken,
  });
});
