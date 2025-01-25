import { z } from 'zod';

import { privateProcedure } from '@/app/trpc/settings';
import { LOGIN_PROVIDERS } from '@/constants';
import { prisma } from '@/prisma';

export const unlinkAccount = privateProcedure
  .input(
    z.object({
      provider: z.nativeEnum(LOGIN_PROVIDERS),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { provider } = input;
    const { session } = ctx;

    const providerIdKey = `${provider}_id` as const;

    await prisma.users.update({
      where: { id: session.user.id },
      data: { [providerIdKey]: null },
    });

    return {
      unlinkedProvider: provider,
    };
  });
