import Pusher from 'pusher-js';

import { PUBLIC_ENV } from '@/constants';
import { customCookies } from '@/utils';

export const pusher = new Pusher(PUBLIC_ENV.PUSHER_KEY, {
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
  authEndpoint: '/api/auth/pusher',
  auth: {
    params: {
      user_id: customCookies.get('USER_ID'),
    },
  },
});
