import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';

export const joinChat = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
    }),
  )
  .mutation(() => {
    return false;
  });
