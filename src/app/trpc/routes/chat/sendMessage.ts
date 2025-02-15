import {
  realtimeDatabase,
  verifyFirebaseIdToken,
} from '@/database/firebase/server';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { CustomError } from '@/utils';

import { publicProcedure } from '../../settings';

export const sendMessage = publicProcedure
  .input(sendMessageSchema)
  .mutation(async ({ input: { message, toUserId }, ctx }) => {
    if (!ctx.isClient) throw new CustomError({ code: 'BAD_REQUEST' });

    const {
      payload: { uid },
    } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

    const myInviteId = await realtimeDatabase
      .ref(`${uid}/chat/${toUserId}/inviteId`)
      .get();

    const toUserChattingRef = realtimeDatabase.ref(`${toUserId}/chat/${uid}`);

    const toUserInviteId = await toUserChattingRef.child('inviteId').get();

    if (
      !myInviteId.exists ||
      !toUserInviteId.exists ||
      myInviteId.val() !== toUserInviteId.val()
    )
      throw new CustomError({ code: 'UNAUTHORIZED' });

    const now = Date.now();

    const ref = await toUserChattingRef.child('msg').push([now, message]);

    return {};
  });
