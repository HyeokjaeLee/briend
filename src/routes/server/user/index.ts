import { router } from '@/app/trpc/settings';

import { create } from './create';
import { fetchSession } from './fetch-session';
import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
  create,
  fetchSession,
});
