import { z } from 'zod';

import { privateProcedure } from '@/app/trpc/settings';
import { LANGUAGE } from '@/constants';
import { firestore } from '@/database/firestore/server';
import type { Firestore } from '@/database/firestore/type';
import { COLLECTIONS } from '@/database/firestore/type';
import type { UserSession } from '@/types/next-auth';
import { getFirebaseAdminAuth } from '@/utils/server';

export const editProfile = privateProcedure
  .input(
    z.object({
      language: z.nativeEnum(LANGUAGE),
      displayName: z.string().min(1).max(20),
      photoURL: z.string().optional(),
    }),
  )
  .mutation(
    async ({
      ctx: {
        session: { user },
      },
      input: { language, displayName, photoURL },
    }) => {
      const adminAuth = await getFirebaseAdminAuth();

      const userId = user.id;

      await Promise.all([
        adminAuth.updateUser(userId, {
          displayName,
          photoURL,
        }),
        firestore((db) =>
          db
            .collection(COLLECTIONS.USERS)
            .doc(userId)
            .update({
              language,
            } satisfies Partial<Firestore.UserInfo>),
        ),
      ]);

      return {
        language,
        name: displayName,
        profileImage: photoURL,
      } satisfies Partial<UserSession>;
    },
  );
