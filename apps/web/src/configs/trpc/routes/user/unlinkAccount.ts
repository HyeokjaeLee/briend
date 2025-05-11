import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

import { privateProcedure } from '@/configs/trpc/settings';
import { LOGIN_PROVIDERS } from '@/constants';
import { firestore } from '@/database/firebase/server';
import { COLLECTIONS } from '@/database/firebase/type';

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

      await firestore
        .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
        .doc(`${provider}-${session.user[idKey]}`)
        .delete();

      await firestore
        .collection(COLLECTIONS.USERS)
        .doc(session.user.id)
        .update({
          [idKey]: FieldValue.delete(),
        });
    } catch (error) {
      console.error(error);
    }

    return provider;
  });
