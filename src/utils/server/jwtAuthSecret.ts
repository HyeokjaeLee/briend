import type { JWTPayload, JWTVerifyResult } from 'jose';
import { jwtVerify, SignJWT } from 'jose';
import { JWTExpired } from 'jose/errors';

import { PRIVATE_ENV } from '@/constants/private-env';

import { CustomError } from '../customError';

interface SignJwtOptions {
  time?: number | string | Date;
  additionalSecret?: string;
}

const sign = (payload: JWTPayload, options?: SignJwtOptions) => {
  const { time = '5m', additionalSecret = '' } = options ?? {};

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(time)
    .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET + additionalSecret));
};

interface JwtVerifyOptions {
  additionalSecret?: string;
}

const verfiy = async <T>(
  jwtToken: string,
  options?: JwtVerifyOptions,
): Promise<JWTVerifyResult<T>> => {
  const { additionalSecret = '' } = options ?? {};

  try {
    return jwtVerify<T>(
      jwtToken,
      new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET + additionalSecret),
    );
  } catch (e) {
    if (e instanceof JWTExpired) {
      throw new CustomError({
        code: 'EXPIRED_CHAT',
      });
    }

    throw e;
  }
};

export const jwtAuthSecret = {
  sign,
  verfiy,
};
