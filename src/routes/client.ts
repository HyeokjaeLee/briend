import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  HOME: createRoute('/', {
    bottomNavType: 'root',
  }),
  MESSAGE: createRoute('/message', {
    bottomNavType: 'root',
  }),
  MESSAGE_ROOM: createRoute<{ dynamicPath: 'id' }>(
    ({ id }) => `/message/${id}`,
  ),
  MORE_MENUS: createRoute('/more', {
    bottomNavType: 'root',
  }),

  LOGIN: createRoute('/login'),
};
