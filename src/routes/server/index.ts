import { router } from '@/app/trpc/settings';

import { chat } from './chat';
import { friend } from './friend';
import { getFirebaseCustomToken } from './getFirebaseCustomToken';
import { user } from './user';

export const apiRouter = router({
  chat,
  friend,
  user,
  getFirebaseCustomToken,
});

export type ApiRouter = typeof apiRouter;
