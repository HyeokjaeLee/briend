import type { JWTVerifyResult } from 'jose';

import { jwtVerify } from 'jose';

import { ENV } from '@/constants/env';

export const jwtSecretVerify = async <T>(
  jwtToken: string,
  additionalSecret = '',
): Promise<JWTVerifyResult<T>> =>
  jwtVerify<T>(
    jwtToken,
    new TextEncoder().encode(ENV.AUTH_SECRET + additionalSecret),
  );
