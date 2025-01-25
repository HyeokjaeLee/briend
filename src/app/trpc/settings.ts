import type { Session } from 'next-auth';

import superjson from 'superjson';

import { auth } from '@/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

const AUTH_EXCEPTION_MESSAGES = [
  '`headers` was called outside a request scope.',
  `Cannot access 'auth' before initialization`,
];

export const createContext = async (
  opts: FetchCreateContextFnOptions | null,
) => {
  let session: Session | null = null;

  try {
    session = await auth();
  } catch (e) {
    if (!(e instanceof Error))
      throw new TRPCError({
        code: 'BAD_GATEWAY',
        message: 'Failed to get session',
      });

    const { message } = e;

    if (!AUTH_EXCEPTION_MESSAGES.some((m) => message.startsWith(m)))
      throw new TRPCError({
        code: 'BAD_GATEWAY',
        message: e.message,
        cause: e.cause,
      });
  }

  return {
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
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      session: opts.ctx.session,
    },
  });
});
