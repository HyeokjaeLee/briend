import { router } from '@/app/trpc/settings';

import { editProfile } from './edit-profile';
import { fetchSession } from './fetch-session';
import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
  fetchSession,
  editProfile,
});
