import type { JWTVerifyResult } from 'jose';

import { jwtVerify } from 'jose';

import { PRIVATE_ENV } from '@/constants/private-env';

export const jwtSecretVerify = async <T>(
  jwtToken: string,
): Promise<JWTVerifyResult<T>> =>
  jwtVerify<T>(jwtToken, new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));
