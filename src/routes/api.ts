import { createRoute } from '@/utils';

export const API_ROUTES = {
  INVITE_CHAT: createRoute<
    undefined,
    'nickname' | 'language' | 'emoji' | 'chat-id' | 'user-id'
  >('/api/invite-chat'),
};
