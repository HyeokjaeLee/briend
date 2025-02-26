import { router } from '@/configs/trpc/settings';

import { editProfile } from './editProfile';
import { logout } from './logout';
import { unlinkAccount } from './unlinkAccount';

export const user = router({
  unlinkAccount,
  editProfile,
  logout,
});
