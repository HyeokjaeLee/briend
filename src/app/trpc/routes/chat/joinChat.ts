import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import {
  realtimeDatabase,
  verifyFirebaseIdToken,
} from '@/database/firebase/server';
import type { ChatItem } from '@/database/firebase/type';
import type { JwtPayload } from '@/types/jwt';
import { assert, CustomError } from '@/utils';
import { jwtAuthSecret } from '@/utils/server';

type Update = Partial<ChatItem>;

export const joinChat = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
      nickname: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { inviteToken, nickname }, ctx }) => {
    if (!ctx.isClient) throw new CustomError({ code: 'BAD_REQUEST' });

    const {
      payload: { uid: inviteeId },
    } = await verifyFirebaseIdToken(ctx.firebaseIdToken);

    assert(inviteeId);

    const {
      payload: { inviterId, inviteId },
    } = await jwtAuthSecret.verfiy<JwtPayload.InviteToken>(inviteToken);

    const connectedAt = Date.now();

    await realtimeDatabase.ref().update({
      [`${inviteeId}/chat/${inviterId}`]: {
        connectedAt,
        inviteId,
      } satisfies Update,
      [`${inviterId}/chat/${inviteeId}`]: {
        connectedAt,
        nickname,
        inviteId,
      } satisfies Update,
    });

    return {
      inviterId,
    };
  });
