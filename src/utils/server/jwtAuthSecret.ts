import type { JWTPayload, JWTVerifyResult } from 'jose';

import { jwtVerify, SignJWT } from 'jose';

import { PRIVATE_ENV } from '@/constants/private-env';

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

  return jwtVerify<T>(
    jwtToken,
    new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET + additionalSecret),
  );
};

export const jwtAuthSecret = {
  sign,
  verfiy,
};
