import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { firestore } from '@/database/firestore/server';
import type { Firestore } from '@/database/firestore/type';
import { COLLECTIONS } from '@/database/firestore/type';
import type { JwtPayload } from '@/types/jwt';
import { objectWithoutUndefined } from '@/utils';
import { jwtAuthSecret } from '@/utils/server';

export const joinChat = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
      nickname: z.string().optional(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ input: { inviteToken, nickname, userId } }) => {
    const {
      payload: { hostUserId },
    } = await jwtAuthSecret.verfiy<JwtPayload.InviteToken>(inviteToken);

    await firestore(async (db) => {
      const batch = db.batch();

      const userCollectionRef = db.collection(COLLECTIONS.USERS);

      const hostChattingRoomRef = userCollectionRef
        .doc(hostUserId)
        .collection(COLLECTIONS.CHATTING_ROOMS)
        .doc(userId);

      batch.set(
        hostChattingRoomRef,
        objectWithoutUndefined({
          type: 'host',
          nickname,
        } satisfies Firestore.ChattingRoom),
        {
          merge: true,
        },
      );

      const guestChattingRoomRef = userCollectionRef
        .doc(userId)
        .collection(COLLECTIONS.CHATTING_ROOMS)
        .doc(hostUserId);

      batch.set(
        guestChattingRoomRef,
        {
          type: 'guest',
        } satisfies Firestore.ChattingRoom,
        {
          merge: true,
        },
      );

      await batch.commit();
    });

    return {
      hostUserId,
    };
  });
