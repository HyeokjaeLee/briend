import type { LANGUAGE } from '@/constants';
import type { LOGIN_PROVIDERS } from '@/constants/etc';
import { firestore } from '@/database/firestore/server';
import { COLLECTIONS, type Firestore } from '@/database/firestore/type';
import type { UserSession } from '@/types/next-auth';
import { getFirebaseAdminAuth } from '@/utils/server';

interface GetUserSessionProps {
  provider: LOGIN_PROVIDERS;
  providerId: string;
  name?: string;
  email?: string;
  profileImage?: string;
  language: LANGUAGE;
  anonymousId: string;
}

export const getUserSession = async ({
  anonymousId,
  language,
  provider,
  providerId,
  email,
  name,
  profileImage,
}: GetUserSessionProps) => {
  const providerAccountRef = await firestore((db) =>
    db
      .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
      .doc(`${provider}-${providerId}`),
  );

  const providerAccount = await providerAccountRef.get();

  const idKey = `${provider}Id` as const;

  const auth = await getFirebaseAdminAuth();

  const usersRef = await firestore((db) => db.collection(COLLECTIONS.USERS));

  const linkByUserId = async (userId: string) => {
    try {
      //! 해당 계정이 다른 계정과의 연동으로 인해 삭제된 경우 예외 발생
      const userAuth = await auth.getUser(userId);

      //TODO: 비회원 동안 쌓았던 정보 이관 로직

      auth.deleteUser(anonymousId);

      const userData = (
        await usersRef.doc(userId).get()
      ).data() as Firestore.UserInfo;

      return {
        id: userAuth.uid,
        name: userAuth.displayName,
        profileImage: userAuth.photoURL,
        email: userAuth.email,
        ...userData,
      } satisfies UserSession;
    } catch {
      await providerAccountRef.delete();
    }
  };

  if (providerAccount.exists) {
    const { userId } = providerAccount.data() as Firestore.ProviderAccount;

    const userSession = await linkByUserId(userId);

    if (userSession) return userSession;
  }

  try {
    await auth.updateUser(anonymousId, {
      displayName: name,
      email,
      photoURL: profileImage,
    });
  } catch (e) {
    if (
      email &&
      e instanceof Error &&
      e.message === 'The email address is already in use by another account.'
    ) {
      const { uid: existedId } = await auth.getUserByEmail(email);

      const userSession = await linkByUserId(existedId);

      if (userSession) {
        const linkedUserSession: Partial<Firestore.UserInfo> = {
          [idKey]: providerId,
        };
        await usersRef.doc(existedId).update(linkedUserSession);

        return {
          ...userSession,
          ...linkedUserSession,
        };
      }
    } else throw e;
  }

  await Promise.all([
    auth.setCustomUserClaims(anonymousId, {
      isAnonymous: false,
    }),
    providerAccountRef.set({ userId: anonymousId }),
    usersRef.doc(anonymousId).set({
      language,
      [idKey]: providerId,
    } satisfies Firestore.UserInfo),
  ]);

  return {
    id: anonymousId,
    name,
    profileImage,
    language,
    email,
    [idKey]: providerId,
  } satisfies UserSession;
};
