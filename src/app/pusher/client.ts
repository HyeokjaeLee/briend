import Pusher from 'pusher-js';

import { ENV } from '@/constants/env';
import { cookies } from '@/stores/cookies';

export const pusher = new Pusher(ENV.PUSHER_KEY, {
  cluster: ENV.PUSHER_CLUSTER,
  authEndpoint: '/api/auth/pusher',
  auth: {
    params: {
      user_id: cookies.get('USER_ID'),
    },
  },
});
