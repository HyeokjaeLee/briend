import { router } from '@/app/trpc/settings';

import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
});
