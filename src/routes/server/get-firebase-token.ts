import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { getFirebaseAdminAuth, jwtAuthSecret } from '@/utils/server';
import { TRPCError } from '@trpc/server';

export const getFirebaseToken = publicProcedure
  .input(z.object({ idToken: z.string() }))
  .query(async ({ input: { idToken } }) => {
    const {
      payload: { id },
    } = await jwtAuthSecret.verfiy<{ id: string }>(idToken);

    if (typeof id !== 'string')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'id is not string',
      });

    const auth = await getFirebaseAdminAuth();

    const token = await auth.createCustomToken(id);

    return token;
  });
