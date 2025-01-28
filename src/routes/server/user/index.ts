import { router } from '@/app/trpc/settings';

import { fetchSession } from './fetch-session';
import { linkAccount } from './link-account';
import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
  linkAccount,
  fetchSession,
});
