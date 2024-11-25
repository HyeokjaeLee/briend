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
  EDIT_PROFILE: createRoute('/private/more/edit-profile', {
    topHeaderType: 'back',
    bottomNavType: 'empty',
  }),
};

export type RouteObject = (typeof ROUTES)[keyof typeof ROUTES];
