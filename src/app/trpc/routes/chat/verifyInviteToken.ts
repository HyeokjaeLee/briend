import { JWTExpired } from 'jose/errors';
import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import type * as JwtPayload from '@/types/jwt';
import { CustomError } from '@/utils';
import { jwtAuthSecret } from '@/utils/server';

export const verfiyInviteToken = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
    }),
  )
  .query(async ({ input: { inviteToken } }) => {
    try {
      const { payload } =
        await jwtAuthSecret.verfiy<JwtPayload.InviteToken>(inviteToken);

      return payload;
    } catch (e) {
      if (e instanceof JWTExpired) {
        throw new CustomError({
          code: 'EXPIRED_CHAT',
        });
      }

      throw e;
    }
  });
