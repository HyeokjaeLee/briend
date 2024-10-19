import type { GetTokenParams } from 'next-auth/jwt';

import { getToken } from 'next-auth/jwt';

import { PRIVATE_ENV } from '@/constants/private-env';
import { IS_DEV } from '@/constants/public-env';

export const getAuthToken = async ({
  secureCookie = !IS_DEV,
  secret = PRIVATE_ENV.AUTH_SECRET,
  ...params
}: GetTokenParams) => {
  return await getToken({ secureCookie, secret, ...params });
};
