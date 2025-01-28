import { router } from '@/app/trpc/settings';

import { getFirebaseToken } from './get-firebase-token';
import { user } from './user';

export const apiRouter = router({
  user,
  getFirebaseToken,
});

export type ApiRouter = typeof apiRouter;
