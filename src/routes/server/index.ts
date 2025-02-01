import { router } from '@/app/trpc/settings';

import { chat } from './chat';
import { getFirebaseCustomToken } from './get-firebase-custom-token';
import { user } from './user';

export const apiRouter = router({
  user,
  getFirebaseCustomToken,
  chat,
});

export type ApiRouter = typeof apiRouter;
