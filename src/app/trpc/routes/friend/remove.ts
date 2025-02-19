import { z } from 'zod';

import { publicProcedure } from '@/app/trpc/settings';
import { realtimeDatabase } from '@/database/firebase/server';
import { onlyClientRequest } from '@/utils/server';

export const remove = publicProcedure
  .input(
    z.object({
      uid: z.string(),
      type: z.enum(['unsubscribe', 'delete']),
    }),
  )
  .mutation(async ({ ctx, input: { uid: friendUserId, type } }) => {
    onlyClientRequest(ctx);

    const { uid: myUserId } = ctx.firebaseSession;

    const myChattingDataPath = `${myUserId}/chat/${friendUserId}`;
    const friendChattingInviteIdPath = `${friendUserId}/chat/${myUserId}`;

    const databaseRef = realtimeDatabase.ref();

    switch (type) {
      case 'unsubscribe':
        await databaseRef.update({
          [`${myChattingDataPath}/inviteId`]: null,
          [friendChattingInviteIdPath]: null,
        });
        break;

      case 'delete':
        await databaseRef.update({
          [myChattingDataPath]: null,
          [friendChattingInviteIdPath]: null,
        });

        break;
    }
  });
