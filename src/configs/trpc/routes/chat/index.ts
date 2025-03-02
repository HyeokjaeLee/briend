import { router } from '@/configs/trpc/settings';

import { createInviteToken } from './createInviteToken';
import { joinChat } from './joinChat';
import { sendMessage } from './sendMessage';
import { verifyInviteToken } from './verifyInviteToken';

export const chat = router({
  createInviteToken,
  verifyInviteToken,
  joinChat,
  sendMessage,
});
