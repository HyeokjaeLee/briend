import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { firestore } from '@/database/firebase/server';
import type { Firestore } from '@/database/firebase/type';
import { COLLECTIONS } from '@/database/firebase/type';
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
      payload: { inviterId, roomId },
    } = await jwtAuthSecret.verfiy<JwtPayload.InviteToken>(inviteToken);

    const userCollectionRef = firestore.collection(COLLECTIONS.USERS);

    const inviteeChattingRoomRef = userCollectionRef
      .doc(userId)
      .collection(COLLECTIONS.CHATTING_ROOMS)
      .doc(inviterId);

    const inviteeChattingRoomData = (
      await inviteeChattingRoomRef.get()
    ).data() as Firestore.ChattingRoom | undefined;

    const inviterChattingRoomRef = userCollectionRef
      .doc(inviterId)
      .collection(COLLECTIONS.CHATTING_ROOMS)
      .doc(userId);

    const batch = firestore.batch();

    //* 과거에 연결된적이 있고 내가 host 였던 경우
    if (inviteeChattingRoomData?.type === 'host') {
      batch.set(inviterChattingRoomRef, {
        type: 'guest',
        roomId,
      } satisfies Firestore.ChattingRoom);

      batch.set(inviteeChattingRoomRef, {
        type: 'host',
      } satisfies Firestore.ChattingRoom);
    } else {
      batch.set(
        inviterChattingRoomRef,
        objectWithoutUndefined({
          type: 'host',
          nickname,
          roomId,
        } satisfies Firestore.ChattingRoom),
      );

      batch.set(inviteeChattingRoomRef, {
        type: 'guest',
      } satisfies Firestore.ChattingRoom);
    }

    await batch.commit();

    return {
      inviterId,
    };
  });
