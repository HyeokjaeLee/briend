import { adminAuth, firestore } from '@/database/firebase/server';
import type { UserInfo } from '@/database/firebase/type';
import { COLLECTIONS } from '@/database/firebase/type';
import type { UserSession } from '@/types/next-auth';

import { privateProcedure } from '../../settings';

export const data = privateProcedure.query(
  async ({
    ctx: {
      session: { user },
    },
  }) => {
    const userId = user.id;

    const userAuth = await adminAuth.getUser(userId);

    const usersRef = firestore.collection(COLLECTIONS.USERS);

    const userData = (await usersRef.doc(userId).get()).data() as UserInfo;

    return {
      id: userAuth.uid,
      name: userAuth.displayName,
      profileImage: userAuth.photoURL,
      email: userAuth.email,
      ...userData,
    } satisfies UserSession;
  },
);
