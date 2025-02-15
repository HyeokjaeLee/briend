import {
  realtimeDatabase,
  verifyFirebaseIdToken,
} from '@/database/firebase/server';
import type { Message } from '@/database/indexed';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { assert, CustomError } from '@/utils';

import { publicProcedure } from '../../settings';

export const sendMessage = publicProcedure
  .input(sendMessageSchema)
  .mutation(async ({ input: { message, receiverId }, ctx }) => {
    if (!ctx.isClient) throw new CustomError({ code: 'BAD_REQUEST' });

    const {
      payload: { uid: senderId },
    } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

    const myInviteId = await realtimeDatabase
      .ref(`${senderId}/chat/${receiverId}/inviteId`)
      .get();

    const toUserChattingRef = realtimeDatabase.ref(
      `${receiverId}/chat/${senderId}`,
    );

    const toUserInviteId = await toUserChattingRef.child('inviteId').get();

    if (
      !myInviteId.exists ||
      !toUserInviteId.exists ||
      myInviteId.val() !== toUserInviteId.val()
    )
      throw new CustomError({ code: 'UNAUTHORIZED' });

    const now = Date.now();

    const ref = await toUserChattingRef.child('msg').push([now, message]);

    const id = ref.key;

    assert(id);

    return {
      id,
      timestamp: now,
      translatedMessage: '',
    } satisfies Pick<Message, 'id' | 'timestamp' | 'translatedMessage'>;
  });
