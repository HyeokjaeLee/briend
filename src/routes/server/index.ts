import { router } from '@/app/trpc/settings';

import { getFirebaseCustomToken } from './get-firebase-custom-token';
import { user } from './user';

export const apiRouter = router({
  user,
  getFirebaseCustomToken,
});

export type ApiRouter = typeof apiRouter;
