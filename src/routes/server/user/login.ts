import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { signIn } from '@/auth';
import { LOGIN_PROVIDERS } from '@/constants';
import { firestore } from '@/database/firestore';
import { getFirebaseAdminAuth } from '@/utils/server';

export const login = publicProcedure
  .input(
    z.object({
      provider: z.nativeEnum(LOGIN_PROVIDERS),
      providerId: z.string(),
      userId: z.string().length(21),
      name: z.string().optional(),
      email: z.string().email().optional(),
      image: z.string().optional(),
    }),
  )
  .mutation(
    async ({ input: { provider, providerId, userId, email, image, name } }) => {
      const userDoc = await firestore((db) =>
        db.collection('users').doc(userId).get(),
      );

      if (!userDoc.exists) {
        const auth = await getFirebaseAdminAuth();

        const idKey = `${provider}_id` as const;

        await Promise.all([
          auth.createUser({
            displayName: name,
            email: email,
            photoURL: image,
            uid: userId,
          }),
          firestore((db) =>
            db
              .collection('users')
              .doc(userId)
              .set({
                [idKey]: providerId,
              }),
          ),
        ]);
      }
    },
  );
