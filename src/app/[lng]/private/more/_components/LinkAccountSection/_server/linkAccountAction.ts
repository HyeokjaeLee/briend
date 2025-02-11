'use server';

import { auth, signIn } from '@/auth';
import { COOKIES, type LOGIN_PROVIDERS } from '@/constants';
import type { JwtPayload } from '@/types/jwt';
import { assert, customCookies } from '@/utils';
import { jwtAuthSecret } from '@/utils/server';

export const linkAccountAction = async (provider: LOGIN_PROVIDERS) => {
  const session = await auth();

  const user = session?.user;

  assert(user);

  const token = await jwtAuthSecret.sign({
    ...user,
    providerToLink: provider,
  } satisfies JwtPayload.LinkBaseAccountToken);

  const severCookies = await customCookies.server();

  severCookies.set(COOKIES.LINK_BASE_ACCOUNT_TOKEN, token, {
    httpOnly: true,
  });

  await signIn(provider);
};
