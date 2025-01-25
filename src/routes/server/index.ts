import { router } from '@/app/trpc/settings';

import { user } from './user';

export const apiRouter = router({
  user,
});

export type ApiRouter = typeof apiRouter;
