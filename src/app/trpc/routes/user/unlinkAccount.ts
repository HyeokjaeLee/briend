import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

import { privateProcedure } from '@/app/trpc/settings';
import { LOGIN_PROVIDERS } from '@/constants';
import { firestore } from '@/database/firestore/server';
import { COLLECTIONS } from '@/database/firestore/type';

export const unlinkAccount = privateProcedure
  .input(
    z.object({
      provider: z.nativeEnum(LOGIN_PROVIDERS),
    }),
  )
  .mutation(async ({ ctx, input: { provider } }) => {
    const { session } = ctx;

    try {
      const idKey = `${provider}Id` as const;

      await firestore((db) =>
        db
          .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
          .doc(`${provider}-${session.user[idKey]}`)
          .delete(),
      );

      await firestore((db) =>
        db
          .collection(COLLECTIONS.USERS)
          .doc(session.user.id)
          .update({
            [idKey]: FieldValue.delete(),
          }),
      );
    } catch (error) {
      console.error(error);
    }

    return provider;
  });
