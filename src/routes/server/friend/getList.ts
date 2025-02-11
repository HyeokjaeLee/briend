import { publicProcedure } from '@/app/trpc/settings';
import { firestore, verifyFirebaseIdToken } from '@/database/firestore/server';
import { COLLECTIONS } from '@/database/firestore/type';

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

    const name =
      user.displayName ||
      chattingRooms.docs.find((doc) => doc.id === uid)?.data().nickname;

    return {
      id: user.uid,
      name,
      profileImage: user.photoURL,
      isAnonymous: user.customClaims?.isAnonymous ?? true,
      isUnsubscribed: false,
    };
  });

  return { friendList };
});
