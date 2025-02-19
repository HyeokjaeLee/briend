import { router } from '@/app/trpc/settings';

import { chat } from './chat';
import { friend } from './friend';
import { user } from './user';

export const apiRouter = router({
  chat,
  friend,
  user,
});

export type ApiRouter = typeof apiRouter;
