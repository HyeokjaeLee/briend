import type { GetTokenParams } from 'next-auth/jwt';

import { getToken } from 'next-auth/jwt';

import { ENV, IS_DEV } from '@/constants/env';
import type { UserSession } from '@/types/next-auth';

export const getAuthToken = async ({
  secureCookie = !IS_DEV,
  secret = ENV.AUTH_SECRET,
  ...params
}: GetTokenParams) => {
  const token = await getToken({
    secureCookie,
    secret,
    ...params,
  });

  return token as UserSession | null;
};
