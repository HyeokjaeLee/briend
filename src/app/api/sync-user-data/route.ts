import { NextResponse } from 'next/server';

import { adminAuth, firestore } from '@/database/firebase/server';
import type { Firestore } from '@/database/firebase/type';
import { COLLECTIONS } from '@/database/firebase/type';
import type { ApiParams } from '@/types/api-params';
import type { JwtPayload } from '@/types/jwt';
import type { UserSession } from '@/types/next-auth';
import { createApiRoute } from '@/utils/api';
import { jwtAuthSecret } from '@/utils/server';

export const POST = createApiRoute<UserSession>(async (req) => {
  const { syncUserToken }: ApiParams.SyncUserData = await req.json();

  const {
    payload: {
      anonymousId,
      language,
      provider,
      providerId,
      email,
      name,
      profileImage,
    },
  } = await jwtAuthSecret.verfiy<JwtPayload.SyncUserToken>(syncUserToken);

  const providerAccountRef = firestore
    .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
    .doc(`${provider}-${providerId}`);

  const providerAccount = await providerAccountRef.get();

  const idKey = `${provider}Id` as const;

  const usersRef = firestore.collection(COLLECTIONS.USERS);

  const result = await (async () => {
    const linkByUserId = async (userId: string) => {
      try {
        //! 해당 계정이 다른 계정과의 연동으로 인해 삭제된 경우 예외 발생
        const userAuth = await adminAuth.getUser(userId);

        //TODO: 비회원 동안 쌓았던 정보 이관 로직

        adminAuth.deleteUser(anonymousId);

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
      await adminAuth.updateUser(anonymousId, {
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
        const { uid: existedId } = await adminAuth.getUserByEmail(email);

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
      adminAuth.setCustomUserClaims(anonymousId, {
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
    };
  })();

  return NextResponse.json(result);
});
