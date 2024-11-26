import { SignJWT } from 'jose';

import { PRIVATE_ENV } from '@/constants/private-env';
import type { JwtPayload } from '@/types/jwt';

export const createFriendToken = async (
  linkedUserId: string,
  payload: JwtPayload.FriendToken,
) => {
  const friendToken = await new SignJWT({
    ...payload,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET + linkedUserId));

  return { friendToken };
};
