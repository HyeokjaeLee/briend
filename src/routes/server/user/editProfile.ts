import { privateProcedure } from '@/app/trpc/settings';
import { firestore } from '@/database/firestore/server';
import type { Firestore } from '@/database/firestore/type';
import { COLLECTIONS } from '@/database/firestore/type';
import { editProfileSchema } from '@/schema/trpc/user';
import type { UserSession } from '@/types/next-auth';
import { getFirebaseAdminAuth } from '@/utils/server';

export const editProfile = privateProcedure.input(editProfileSchema).mutation(
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
