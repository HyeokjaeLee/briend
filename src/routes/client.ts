import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  CHATTING: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  CHATTING_ROOM: createRoute<'id'>(({ id }) => `/message/${id}`),
  MORE_MENUS: createRoute('/private/more', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  INVITE_CHAT: createRoute('/private/invite-chat', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  INVITE_CHAT_QR: createRoute('/private/invite-chat/qr', {
    topHeaderType: 'back',
    bottomNavType: 'empty',
  }),

  LOGIN: createRoute('/guest/login'),
  TEST: createRoute('/test'),
};
