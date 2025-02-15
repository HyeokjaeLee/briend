import { nanoid } from 'nanoid';

import { privateProcedure } from '@/app/trpc/settings';
import { createInviteTokenSchema } from '@/schema/trpc/chat';
import type { JwtPayload } from '@/types/jwt';
import { jwtAuthSecret } from '@/utils/server';

export const createInviteToken = privateProcedure
  .input(createInviteTokenSchema)
  .mutation(async ({ ctx, input: { language } }) => {
    const id = ctx.session.user.id;
    const inviteId = nanoid();

    const inviteToken = await jwtAuthSecret.sign(
      {
        inviterId: id,
        inviteeLanguage: language,
        inviteId,
      } satisfies JwtPayload.InviteToken,
      {
        time: '5m',
      },
    );

    return inviteToken;
  });
