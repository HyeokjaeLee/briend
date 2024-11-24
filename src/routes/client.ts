import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  HOME: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'chat-title',
  }),
  CHATTING_ROOM: createRoute<'channelId'>(
    ({ channelId }) => `/chatting/${channelId}`,
    {
      topHeaderType: 'empty',
      bottomNavType: 'empty',
    },
  ),

  MORE_MENUS: createRoute('/private/more', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'more-title',
  }),
  INVITE_QR: createRoute<'userId', 'lng'>(
    ({ userId }) => `/private/invite/${userId}/qr`,
    {
      topHeaderType: 'back',
      bottomNavType: 'empty',
    },
  ),
  CONNECTING_FRIEND: createRoute<'userId'>(
    ({ userId }) => `/private/invite/${userId}/connecting`,
    {
      topHeaderType: 'back',
      bottomNavType: 'empty',
    },
  ),
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
  JOIN_CHAT: createRoute<undefined, 'inviteToken'>('/chatting/join'),
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

  JOIN_CHAT2: createRoute<undefined, 'inviteToken'>('/api/join-chat', {
    disableI18n: true,
  }),
  EXPIRED_CHAT: createRoute('/expired-chat', {
    topHeaderType: 'back',
    bottomNavType: 'empty',
  }),

  EDIT_PROFILE: createRoute('/private/more/edit-profile', {
    topHeaderType: 'back',
    bottomNavType: 'empty',
  }),

  ERROR_TO: createRoute<undefined, 'status'>('/error-to'),
};

export type RouteObject = (typeof ROUTES)[keyof typeof ROUTES];
