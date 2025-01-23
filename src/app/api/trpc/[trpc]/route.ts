import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '../_configs/appRouter';
import { createContext } from '../_configs/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
