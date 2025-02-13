import { privateProcedure } from '@/app/trpc/settings';
import { adminAuth } from '@/database/firebase/server';

export const getFirebaseCustomToken = privateProcedure.query(
  async ({ ctx }) => {
    const token = await adminAuth.createCustomToken(ctx.session.user.id);

    return token;
  },
);
