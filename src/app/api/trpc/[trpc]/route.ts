import { apiRouter } from '@/app/trpc/routes';
import { createContext } from '@/app/trpc/settings';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: apiRouter,
    createContext,
  });

export { handler as GET, handler as POST };
