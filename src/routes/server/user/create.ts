import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { getFirebaseAdminAuth } from '@/utils/server';

export const create = publicProcedure
  .input(
    z.object({
      id: z.string().length(21),
      email: z.string().email().optional(),
      name: z.string().min(1).optional(),
      google_id: z.string().optional(),
      kakao_id: z.string().optional(),
      apple_id: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const { id, email, name, google_id, kakao_id, apple_id } = input;

    const firebaseAdminAuth = await getFirebaseAdminAuth();

    const firebaseUser = await firebaseAdminAuth.createUser({
      uid: id,
      email,
      displayName: name,
    });

    return firebaseUser;
  });
