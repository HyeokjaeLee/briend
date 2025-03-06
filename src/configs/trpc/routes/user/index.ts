import { router } from '@/configs/trpc/settings';

import { data } from './data';
import { editProfile } from './editProfile';
import { logout } from './logout';
import { unlinkAccount } from './unlinkAccount';

export const user = router({
  unlinkAccount,
  editProfile,
  logout,
  data,
});
