import { publicProcedure } from '@/configs/trpc/settings';
import { realtimeDatabase } from '@/database/firebase/server';
import { onlyClientRequest } from '@/utils/server';

export const list = publicProcedure.query(async ({ ctx }) => {
  onlyClientRequest(ctx);

  const { uid } = ctx.firebaseSession;

  const adminAuth = ctx.firebaseAdminAuth;

  const chattingPath = `${uid}/chat`;

  const chattingDataRef = realtimeDatabase.ref(chattingPath);

  const userChattingDataSnapshot = await chattingDataRef.once('value');

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
          isLinked: false,
        };

      let name = user.displayName;

      const chattingItemRef = chattingDataRef.child(uid);

      const [inviteIdSnapshot, nameSnapshot] = await Promise.all([
        chattingItemRef.child('inviteId').get(),
        name ? null : chattingItemRef.child('nickname').get(),
      ]);

      if (nameSnapshot) name = nameSnapshot.val();

      if (!name) {
        const nicknameSnapshot = await chattingItemRef.child('nickname').get();

        name = nicknameSnapshot.val();
      }

      return {
        id: user.uid,
        name,
        profileImage: user.photoURL,
        isAnonymous: user.customClaims?.isAnonymous ?? true,
        isUnsubscribed: false,
        isLinked: inviteIdSnapshot.exists(),
      };
    }),
  );

  return { friendList };
});
