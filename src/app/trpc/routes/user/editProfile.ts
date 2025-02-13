import { privateProcedure } from '@/app/trpc/settings';
import { adminAuth, firestore } from '@/database/firebase/server';
import type { Firestore } from '@/database/firebase/type';
import { COLLECTIONS } from '@/database/firebase/type';
import { editProfileSchema } from '@/schema/trpc/user';
import type { UserSession } from '@/types/next-auth';

export const editProfile = privateProcedure.input(editProfileSchema).mutation(
  async ({
    ctx: {
      session: { user },
    },
    input: { language, displayName, photoURL },
  }) => {
    const userId = user.id;

    await Promise.all([
      adminAuth.updateUser(userId, {
        displayName,
        photoURL,
      }),
      firestore
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({
          language,
        } satisfies Partial<Firestore.UserInfo>),
    ]);

    return {
      language,
      name: displayName,
      profileImage: photoURL,
    } satisfies Partial<UserSession>;
  },
);
