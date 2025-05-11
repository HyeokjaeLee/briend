import { privateProcedure } from '@/configs/trpc/settings';
import { adminAuth, firestore } from '@/database/firebase/server';
import { COLLECTIONS, type UserInfo } from '@/database/firebase/type';
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
        } satisfies Partial<UserInfo>),
    ]);

    return {
      language,
      name: displayName,
      profileImage: photoURL,
    } satisfies Partial<UserSession>;
  },
);
