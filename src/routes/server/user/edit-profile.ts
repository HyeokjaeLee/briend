import { z } from 'zod';

import { privateProcedure } from '@/app/trpc/settings';
import { prisma } from '@/prisma';

export const editProfile = privateProcedure
  .input(
    z.object({
      nickname: z.string().min(1),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { nickname } = input;
    const { session } = ctx;

    await prisma.users.update({
      where: { id: session.user.id },
      data: { name: nickname },
    });

    return {
      nickname,
    };
  });
