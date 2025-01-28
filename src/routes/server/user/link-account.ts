import { decodeJwt } from 'jose';
import { z } from 'zod';

import { privateProcedure, publicProcedure } from '@/app/trpc/settings';
import { LOGIN_PROVIDERS } from '@/constants';
import { getFirebaseAdminAuth } from '@/utils/server';
import { getFirebaseAdminApp } from '@/utils/server/getFirebaseAdminApp';

export const linkAccount = publicProcedure
  .input(z.object({ provider: z.nativeEnum(LOGIN_PROVIDERS) }))
  .mutation(async ({ input, ctx }) => {
    const { provider } = input;

    const test = await getFirebaseAdminAuth();

    const test2 = await test.createCustomToken('test');

    return 'ss';
  });
