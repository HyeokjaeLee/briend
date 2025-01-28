import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { LANGUAGE, LOGIN_PROVIDERS } from '@/constants';
import { firestore } from '@/database/firestore/server';
import type { Firestore } from '@/database/firestore/type';
import type { UserSession } from '@/types/next-auth';
import { createId } from '@/utils';
import { getFirebaseAdminAuth } from '@/utils/server';

export const fetchSession = publicProcedure
  .input(
    z.object({
      provider: z.nativeEnum(LOGIN_PROVIDERS),
      providerId: z.string(),
      userId: z.string().length(21),
      name: z.string(),
      email: z.string().email().optional(),
      profileImage: z.string().optional(),
      language: z.nativeEnum(LANGUAGE),
    }),
  )
  .mutation(async ({ input }) => {
    const providerAccountId = `${input.provider}-${input.providerId}`;

    const providerAccountDoc = await firestore((db) =>
      db.collection('providerAccounts').doc(providerAccountId).get(),
    );

    const idKey = `${input.provider}Id` as const;

    let id = input.userId;

    const userSession: UserSession = {
      id,
      name: input.name,
      profileImage: input.profileImage,
      language: input.language,
      email: input.email,
      [idKey]: input.providerId,
    };

    const auth = await getFirebaseAdminAuth();

    if (providerAccountDoc.exists) {
      const { userId } = providerAccountDoc.data() as Firestore.ProviderAccount;

      const userDoc = await firestore((db) =>
        db.collection('users').doc(userId).get(),
      );

      const savedUserInfo = userDoc.data() as Firestore.UserInfo;

      return {
        ...userSession,
        ...savedUserInfo,
        firebaseToken: await auth.createCustomToken(id),
      };
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      //* 존재 하지 않는 id를 생성할 때 까지 반복
      try {
        await auth.getUser(id);

        id = createId();
      } catch {
        break;
      }
    }

    userSession.id = id;

    await Promise.all([
      auth.createUser({
        displayName: input.name,
        email: input.email,
        photoURL: input.profileImage,
        uid: id,
      }),
      firestore((db) =>
        db
          .collection('providerAccounts')
          .doc(providerAccountId)
          .set({ userId: id }),
      ),
      firestore((db) =>
        db
          .collection('users')
          .doc(id)
          .set({
            language: input.language,
            [idKey]: input.providerId,
          } satisfies Firestore.UserInfo),
      ),
    ]);

    return {
      ...userSession,
      firebaseToken: await auth.createCustomToken(id),
    };
  });
