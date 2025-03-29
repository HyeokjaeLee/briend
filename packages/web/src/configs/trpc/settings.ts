import { initTRPC } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { Auth } from 'firebase-admin/auth';
import superjson from 'superjson';

import { auth } from '@/configs/auth';
import { verifyFirebaseIdToken } from '@/database/firebase/server';
import { CustomError } from '@/utils';

export interface FirebaseSession {
  email?: string | null;
  uid: string;
  name?: string | null;
  isAnonymous: boolean;
}

export const createContext = async (
  opts: FetchCreateContextFnOptions | null,
) => {
  const session = await auth();

  const headers = opts?.req.headers;
  const isClient = headers?.get('isClient') === 'true';

  const commonContext = {
    session,
    opts,
  };

  let firebaseSession: FirebaseSession | null = null;
  let firebaseAdminAuth: Auth | undefined;

  if (isClient) {
    const firebaseIdToken = headers.get('firebaseIdToken');

    const { payload, adminAuth } = await verifyFirebaseIdToken(firebaseIdToken);

    firebaseAdminAuth = adminAuth;

    firebaseSession = {
      email: payload.email,
      uid: payload.uid,
      name: payload.name,
      isAnonymous: !!payload.isAnonymous,
    };
  }

  return { ...commonContext, isClient, firebaseSession, firebaseAdminAuth };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;

export const createCaller = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.session) {
    throw new CustomError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      session: opts.ctx.session,
    },
  });
});
