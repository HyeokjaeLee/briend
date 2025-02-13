import { NextResponse } from 'next/server';

import { firestore, adminAuth } from '@/database/firebase/server';
import type { Firestore } from '@/database/firebase/type';
import { COLLECTIONS } from '@/database/firebase/type';
import type { ApiParams } from '@/types/api-params';
import type { JwtPayload } from '@/types/jwt';
import type { UserSession } from '@/types/next-auth';
import { createApiRoute } from '@/utils/api';
import { jwtAuthSecret } from '@/utils/server';

export const POST = createApiRoute<UserSession>(async (req) => {
  const { linkBaseAccountToken, linkNewAccountToken }: ApiParams.LinkAccount =
    await req.json();

  const {
    payload: { providerToLink, ...linkAccountPayload },
  } =
    await jwtAuthSecret.verfiy<JwtPayload.LinkBaseAccountToken>(
      linkBaseAccountToken,
    );

  const {
    payload: { providerAccountId, ...newAccount },
  } =
    await jwtAuthSecret.verfiy<JwtPayload.LinkNewAccountToken>(
      linkNewAccountToken,
    );

  const providerAccountRef = firestore
    .collection(COLLECTIONS.PROVIDER_ACCOUNTS)
    .doc(`${providerToLink}-${providerAccountId}`);

  const providerAccount = await providerAccountRef.get();

  const baseUserId = linkAccountPayload.id;

  const usersRef = firestore.collection(COLLECTIONS.USERS);

  const idKey = `${providerToLink}Id` as const;

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

    const existedUserAuth = await adminAuth.getUser(existedUserId);

    const displayName = linkAccountPayload.name || existedUserAuth.displayName;

    const email = linkAccountPayload.email || existedUserAuth.email;

    const photoURL =
      linkAccountPayload.profileImage || existedUserAuth.photoURL;

    await Promise.all([
      adminAuth.updateUser(baseUserId, {
        displayName,
        email,
        photoURL,
      }),
      adminAuth.deleteUser(existedUserId),
    ]);

    return NextResponse.json({
      ...linkAccountPayload,
      [idKey]: providerAccountId,
      name: displayName,
      email,
      profileImage: photoURL,
    });
  } else {
    const displayName = linkAccountPayload.name || newAccount.name;

    const email = linkAccountPayload.email || newAccount.email || undefined;

    const photoURL = linkAccountPayload.profileImage || newAccount.profileImage;

    await Promise.all([
      adminAuth.updateUser(baseUserId, {
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

    return NextResponse.json({
      ...linkAccountPayload,
      [idKey]: providerAccountId,
      name: displayName,
      email,
      profileImage: photoURL,
    });
  }
});
