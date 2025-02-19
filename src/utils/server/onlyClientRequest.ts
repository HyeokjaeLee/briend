import type { Auth } from 'firebase-admin/auth';

import type { createContext, FirebaseSession } from '@/app/trpc/settings';

import { CustomError } from '../customError';

type Context = Awaited<ReturnType<typeof createContext>>;

type AssertFunction = (
  ctx: Awaited<ReturnType<typeof createContext>>,
) => asserts ctx is Context & {
  isClient: true;
  firebaseSession: FirebaseSession;
  firebaseAdminAuth: Auth;
};

export const onlyClientRequest: AssertFunction = (ctx) => {
  if (!ctx.isClient || !ctx.firebaseSession) {
    throw new CustomError({ code: 'BAD_REQUEST' });
  }
};
