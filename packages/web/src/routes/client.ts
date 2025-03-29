import { createRoute } from '@/utils';

export const ROUTES = {
  FRIEND_LIST: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  CHATTING_ROOM: createRoute<'userId'>(({ userId }) => `/chatting/${userId}`),
  MORE_MENUS: createRoute('/private/more', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  INVITE_CHAT: createRoute('/private/invite-chat', {
    bottomNavType: 'root',
    topHeaderType: 'root',
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
  INSTALL_PWA: createRoute('/install-pwa', {
    topHeaderType: 'back',
  }),
};

export type RouteObject = (typeof ROUTES)[keyof typeof ROUTES];
