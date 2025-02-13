import { z } from 'zod';

import { realtimeDatabase } from '@/database/firebase/server';
import type { UserRealtimeData } from '@/database/firebase/type';

import { privateProcedure } from '../../settings';

export const sendMessage = privateProcedure
  .input(
    z.object({
      message: z.string(),
    }),
  )
  .mutation(async ({ input: { message } }) => {
    await realtimeDatabase.ref('/chat').update({
      test89: {
        connectedAt: Date.now(),
        msg: [[message, Date.now(), message, null]],
      },
    });

    return null;
  });
