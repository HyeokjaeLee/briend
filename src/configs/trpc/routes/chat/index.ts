import { router } from '@/configs/trpc/settings';

import { createInviteToken } from './createInviteToken';
import { joinChat } from './joinChat';
import { sendMessage } from './sendMessage';
import { verfiyInviteToken } from './verifyInviteToken';

export const chat = router({
  createInviteToken,
  verfiyInviteToken,
  joinChat,
  sendMessage,
});
