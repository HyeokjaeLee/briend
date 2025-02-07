import superjson from 'superjson';

import { auth } from '@/auth';
import { CustomError } from '@/utils';
import { initTRPC } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createContext = async (
  opts: FetchCreateContextFnOptions | null,
) => {
  const session = await auth();

  const firebaseIdToken = opts?.req.headers.get('firebaseIdToken');

  return {
    firebaseIdToken,
    session,
    opts,
  };
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
