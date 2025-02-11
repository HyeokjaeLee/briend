import { router } from '@/app/trpc/settings';

import { getFriendList } from './getList';

export const friend = router({
  getFriendList,
});
