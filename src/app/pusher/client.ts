import Pusher from 'pusher-js';

import { PUBLIC_ENV } from '@/constants/public-env';
import { cookies } from '@/stores/cookies';

export const pusher = new Pusher(PUBLIC_ENV.PUSHER_KEY, {
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
  authEndpoint: '/api/auth/pusher',
  auth: {
    params: {
      user_id: cookies.get('USER_ID'),
    },
  },
});
