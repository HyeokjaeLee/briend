import { router } from '@/app/trpc/settings';

import { createInviteToken } from './createInviteToken';
import { joinChat } from './joinChat';
import { verfiyInviteToken } from './verifyInviteToken';

export const chat = router({
  createInviteToken,
  verfiyInviteToken,
  joinChat,
});
