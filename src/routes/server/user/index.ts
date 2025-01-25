import { router } from '@/app/trpc/settings';

import { create } from './create';
import { login } from './login';
import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
  create,
  login,
});
