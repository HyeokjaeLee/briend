import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { realtimeDatabase } from '@/database/firebase/server';
import type { ChatItem } from '@/database/firebase/type';
import type * as JwtPayload from '@/types/jwt';
import { assert, objectWithoutUndefined } from '@/utils';
import { jwtAuthSecret, onlyClientRequest } from '@/utils/server';

type Update = Partial<ChatItem>;

export const joinChat = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
      nickname: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { inviteToken, nickname }, ctx }) => {
    onlyClientRequest(ctx);

    const inviteeId = ctx.firebaseSession.uid;

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
      [`${inviterId}/chat/${inviteeId}`]: objectWithoutUndefined({
        connectedAt,
        nickname,
        inviteId,
      }) satisfies Update,
    });

    return {
      inviterId,
    };
  });
