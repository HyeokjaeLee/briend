import { z } from 'zod';

import { publicProcedure } from '@/configs/trpc/settings';
import { LANGUAGE } from '@/constants';
import { realtimeDatabase } from '@/database/firebase/server';
import { assertEnum } from '@/utils';
import { onlyClientRequest } from '@/utils/server';

export const myLanguage = publicProcedure
  .input(
    z.object({
      receiverId: z.string(),
    }),
  )
  .query(async ({ ctx, input: { receiverId } }) => {
    onlyClientRequest(ctx);

    const senderId = ctx.firebaseSession.uid;

    const toUserChattingRef = realtimeDatabase.ref(
      `${receiverId}/chat/${senderId}`,
    );

    const senderLanguage =
      ctx.session?.user.language ??
      (await toUserChattingRef.child('inviteeLanguage').get()).val();

    assertEnum(LANGUAGE, senderLanguage);

    return senderLanguage;
  });
