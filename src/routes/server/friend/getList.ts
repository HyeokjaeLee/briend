import { publicProcedure } from '@/app/trpc/settings';
import { firestore } from '@/database/firestore/server';
import { COLLECTIONS } from '@/database/firestore/type';
import { verifyFirebaseIdToken } from '@/utils/server';

export const getFriendList = publicProcedure.query(async ({ ctx }) => {
  if (!ctx.isClient) return { friendList: [] };

  const {
    payload: { uid },
    adminAuth,
  } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

  const chattingRooms = await firestore((db) =>
    db
      .collection(`${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.CHATTING_ROOMS}`)
      .get(),
  );

  const friendIdList = chattingRooms.docs.map((doc) => ({
    uid: doc.id,
  }));

  const { users } = await adminAuth.getUsers(friendIdList);

  const userMap = new Map(users.map((user) => [user.uid, user]));

  const friendList = friendIdList.map(({ uid }) => {
    const user = userMap.get(uid);

    if (!user)
      return {
        id: uid,
        name: undefined,
        profileImage: undefined,
        isAnonymous: true,
        isUnsubscribed: true,
      };

    return {
      id: user.uid,
      name: user.displayName,
      profileImage: user.photoURL,
      isAnonymous: !!user.customClaims?.isAnonymous,
      isUnsubscribed: false,
    };
  });

  return { friendList };
});
