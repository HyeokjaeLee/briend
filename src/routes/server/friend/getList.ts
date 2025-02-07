import { publicProcedure } from '@/app/trpc/settings';
import { firestore } from '@/database/firestore/server';
import { COLLECTIONS } from '@/database/firestore/type';
import { verifyFirebaseIdToken } from '@/utils/server';

export const getFriendList = publicProcedure.query(async ({ ctx }) => {
  const {
    payload: { uid },
    adminAuth,
  } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

  const chattingRooms = await firestore((db) =>
    db
      .collection(`${COLLECTIONS.USERS}/${uid}/${COLLECTIONS.CHATTING_ROOMS}`)
      .get(),
  );

  const UserList = await adminAuth.getUsers(
    chattingRooms.docs.map((doc) => ({
      uid: doc.id,
    })),
  );

  const friendList = UserList.users.map((user) => ({
    id: user.uid,
    name: user.displayName,
    profileImage: user.photoURL,
  }));

  return { friendList };
});
