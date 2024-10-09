import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  CHATTING_LIST: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'chat-title',
  }),
  CHATTING_ROOM: createRoute<undefined, 'channelId'>('/chatting', {
    topHeaderType: 'back',
  }),

  MORE_MENUS: createRoute('/private/more', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'more-title',
  }),
  INVITE_CHAT: createRoute('/private/invite-chat', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'invite-chat-title',
  }),
  INVITE_CHAT_QR: createRoute<'inviteToken'>(
    ({ inviteToken }) => `/private/invite-chat/${inviteToken}`,
    {
      topHeaderType: 'back',
      bottomNavType: 'empty',
    },
  ),
  INVITED_CHAT_ENTER: createRoute<'hostId', 'expires' | 'accessToken'>(
    ({ hostId }) => `/enter/${hostId}`,
    {
      topHeaderType: 'back',
      bottomNavType: 'empty',
    },
  ),

  LOGIN: createRoute('/guest/login', {
    topHeaderType: 'back',
  }),
  TEST: createRoute('/test'),

  JOIN_CHAT: createRoute<undefined, 'inviteToken'>('/api/join-chat'),
  EXPIRED_CHAT: createRoute('/expired-chat', {
    topHeaderType: 'back',
    bottomNavType: 'empty',
  }),

  EDIT_PROFILE: createRoute('/private/more/edit-profile', {
    topHeaderType: 'back',
  }),

  EDIT_INVITE_MESSAGE: createRoute('/private/more/edit-invite-message', {
    topHeaderType: 'back',
  }),
};

export type RouteObject = (typeof ROUTES)[keyof typeof ROUTES];
