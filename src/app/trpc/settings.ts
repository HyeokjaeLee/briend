import superjson from 'superjson';

import { auth } from '@/auth';
import { CustomError } from '@/utils';
import { initTRPC } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

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

  if (!isClient) return { ...commonContext, isClient: false as const };

  const firebaseIdToken = headers.get('firebaseIdToken');

  return { ...commonContext, isClient: true as const, firebaseIdToken };
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
