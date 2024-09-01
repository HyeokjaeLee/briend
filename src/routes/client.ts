import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  HOME: createRoute('/', {
    bottomNavType: 'root',
    topHeaderType: 'root',
  }),
  MESSAGE: createRoute('/message', {
    bottomNavType: 'root',
  }),
  MESSAGE_ROOM: createRoute<{ dynamicPath: 'id' }>(
    ({ id }) => `/message/${id}`,
  ),
  MORE_MENUS: createRoute('private/more', {
    bottomNavType: 'root',
  }),

  LOGIN: createRoute('/guest/login'),
};
