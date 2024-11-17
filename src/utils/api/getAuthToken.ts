import type { GetTokenParams } from 'next-auth/jwt';

import { getToken } from 'next-auth/jwt';

import { PRIVATE_ENV } from '@/constants/private-env';
import { IS_DEV } from '@/constants/public-env';
import type { UserSession } from '@/types/next-auth';

export const getAuthToken = async ({
  secureCookie = !IS_DEV,
  secret = PRIVATE_ENV.AUTH_SECRET,
  ...params
}: GetTokenParams) => {
  const token = await getToken({
    secureCookie,
    secret,
    ...params,
  });

  return token as UserSession | null;
};
