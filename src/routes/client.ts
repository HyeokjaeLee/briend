import { createRoute } from '@/utils';

export const ROUTES = {
  FRIEND_LIST: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
    topHeaderTitle: 'chat-title',
  }),
  CHATTING_ROOM: createRoute<'userId'>(({ userId }) => `/chatting/${userId}`),
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
    },
  ),
  JOIN_CHAT: createRoute<undefined, 'inviteToken'>('/chatting/join', {
    topHeaderType: 'none',
    bottomNavType: 'none',
  }),
  INVITED_CHAT_ENTER: createRoute<'hostId', 'expires' | 'accessToken'>(
    ({ hostId }) => `/enter/${hostId}`,
    {
      topHeaderType: 'back',
    },
  ),
  LOGIN: createRoute('/guest/login', {
    topHeaderType: 'back',
    bottomNavType: 'none',
  }),
  EDIT_PROFILE: createRoute('/private/more/edit-profile', {
    topHeaderType: 'back',
  }),
  TEST: createRoute('/test', {
    topHeaderType: 'back',
  }),
};

export type RouteObject = (typeof ROUTES)[keyof typeof ROUTES];
