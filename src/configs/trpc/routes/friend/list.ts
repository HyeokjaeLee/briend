import { publicProcedure } from '@/configs/trpc/settings';
import { LANGUAGE } from '@/constants';
import { firestore, realtimeDatabase } from '@/database/firebase/server';
import { COLLECTIONS } from '@/database/firebase/type';
import { assert, assertEnum } from '@/utils';
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
          language: undefined,
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

      const userData = await firestore
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .get();

      let language = userData.data()?.language;

      if (!language) {
        language = (await chattingItemRef.child('inviteeLanguage').get()).val();
      }

      assertEnum(LANGUAGE, language);
      assert(name);

      return {
        id: user.uid,
        name,
        profileImage: user.photoURL,
        isAnonymous: user.customClaims?.isAnonymous ?? true,
        isUnsubscribed: false,
        isLinked: inviteIdSnapshot.exists(),
        language,
      };
    }),
  );

  return { friendList };
});
