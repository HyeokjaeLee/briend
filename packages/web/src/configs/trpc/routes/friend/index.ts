import { router } from '@/configs/trpc/settings';

import { list } from './list';
import { remove } from './remove';

export const friend = router({
  list,
  remove,
});
