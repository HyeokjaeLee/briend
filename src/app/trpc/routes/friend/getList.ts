import { publicProcedure } from '@/app/trpc/settings';
import {
  realtimeDatabase,
  verifyFirebaseIdToken,
} from '@/database/firebase/server';

export const getFriendList = publicProcedure.query(async ({ ctx }) => {
  if (!ctx.isClient) return { friendList: [] };

  const {
    payload: { uid },
    adminAuth,
  } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

  const chattingPath = `${uid}/chat`;
  const userChattingDataSnapshot = await realtimeDatabase
    .ref(chattingPath)
    .once('value');

  const friendIdList: {
    uid: string;
  }[] = [];

  userChattingDataSnapshot.forEach(({ key }) => {
    friendIdList.push({
      uid: key,
    });
  });

  const { users } = await adminAuth.getUsers(friendIdList);

  const userMap = new Map(users.map((user) => [user.uid, user]));

  const friendList = await Promise.all(
    friendIdList.map(async ({ uid }) => {
      const user = userMap.get(uid);

      if (!user)
        return {
          id: uid,
          name: undefined,
          profileImage: undefined,
          isAnonymous: true,
          isUnsubscribed: true,
        };

      let name = user.displayName;

      if (!name) {
        const nicknameSnapshot = await realtimeDatabase
          .ref(`${chattingPath}/${uid}/nickname`)
          .get();

        name = nicknameSnapshot.val();
      }

      return {
        id: user.uid,
        name,
        profileImage: user.photoURL,
        isAnonymous: user.customClaims?.isAnonymous ?? true,
        isUnsubscribed: false,
      };
    }),
  );

  return { friendList };
});
