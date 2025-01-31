import { router } from '@/app/trpc/settings';

import { editProfile } from './edit-profile';
import { logout } from './logout';
import { unlinkAccount } from './unlink-account';

export const user = router({
  unlinkAccount,
  editProfile,
  logout,
});
