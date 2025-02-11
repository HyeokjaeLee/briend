import { privateProcedure } from '@/app/trpc/settings';
import { getFirebaseAdminAuth } from '@/database/firestore/server';

export const getFirebaseCustomToken = privateProcedure.query(
  async ({ ctx }) => {
    const auth = await getFirebaseAdminAuth();

    const token = await auth.createCustomToken(ctx.session.user.id);

    return token;
  },
);
