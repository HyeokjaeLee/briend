import { firestore } from '@/database/firestore/server';
import type { Firestore } from '@/database/firestore/type';
import { COLLECTIONS } from '@/database/firestore/type';
import type { JwtPayload } from '@/types/jwt';
import type { UserSession } from '@/types/next-auth';
import { getFirebaseAdminAuth, jwtAuthSecret } from '@/utils/server';

interface LinkAccountProps {
  linkAccountToken: string;
  newAccount: {
    profileImage?: string;
    name?: string;
    email?: string;
  };
  providerAccountId: string;
}

export const linkAccount = async ({
  linkAccountToken,
  providerAccountId,
  newAccount,
}: LinkAccountProps): Promise<UserSession> => {
  const {
    payload: { providerToLink, ...linkAccountPayload },
  } = await jwtAuthSecret.verfiy<JwtPayload.LinkAccountToken>(linkAccountToken);

  const providerAccountRef = await firestore((db) =>
    db
      .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
      .doc(`${providerToLink}-${providerAccountId}`),
  );

  const providerAccount = await providerAccountRef.get();

  const baseUserId = linkAccountPayload.id;

  const usersRef = await firestore((db) => db.collection(COLLECTIONS.USERS));

  const idKey = `${providerToLink}Id` as const;
  const auth = await getFirebaseAdminAuth();

  if (providerAccount.exists) {
    const { userId: existedUserId } =
      providerAccount.data() as Firestore.ProviderAccount;

    await Promise.all([
      usersRef.doc(baseUserId).update({
        [idKey]: providerAccountId,
      }),
      usersRef.doc(existedUserId).delete(),
      providerAccountRef.update({
        userId: baseUserId,
      } satisfies Firestore.ProviderAccount),
    ]);

    const existedUserAuth = await auth.getUser(existedUserId);

    const displayName = linkAccountPayload.name || existedUserAuth.displayName;

    const email = linkAccountPayload.email || existedUserAuth.email;

    const photoURL =
      linkAccountPayload.profileImage || existedUserAuth.photoURL;

    await Promise.all([
      auth.updateUser(baseUserId, {
        displayName,
        email,
        photoURL,
      }),
      auth.deleteUser(existedUserId),
    ]);

    return {
      ...linkAccountPayload,
      [idKey]: providerAccountId,
      name: displayName,
      email,
      profileImage: photoURL,
    };
  } else {
    const displayName = linkAccountPayload.name || newAccount.name;

    const email = linkAccountPayload.email || newAccount.email || undefined;

    const photoURL = linkAccountPayload.profileImage || newAccount.profileImage;

    await Promise.all([
      auth.updateUser(baseUserId, {
        displayName,
        email,
        photoURL,
      }),
      providerAccountRef.set({
        userId: baseUserId,
      } satisfies Firestore.ProviderAccount),
      usersRef.doc(baseUserId).update({
        [idKey]: providerAccountId,
      }),
    ]);

    return {
      ...linkAccountPayload,
      [idKey]: providerAccountId,
      name: displayName,
      email,
      profileImage: photoURL,
    };
  }
};
