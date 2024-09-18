import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  HOME: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  MESSAGE: createRoute('/message', {
    bottomNavType: 'root',
  }),
  MESSAGE_ROOM: createRoute<'id'>(({ id }) => `/message/${id}`),
  MORE_MENUS: createRoute('/private/more', {
    bottomNavType: 'root',
  }),
  INVITE_CHAT: createRoute('/private/invite-chat', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),

  LOGIN: createRoute('/guest/login'),
  TEST: createRoute('/test'),
};
