import { getCookie } from 'cookies-next';
import Pusher from 'pusher-js';

import { COOKIES } from '@/constants/cookies-key';
import { PUBLIC_ENV } from '@/constants/public-env';

export const pusher = new Pusher(PUBLIC_ENV.PUSHER_KEY, {
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
  authEndpoint: '/api/auth/pusher',
  auth: {
    params: {
      user_id: getCookie(COOKIES.USER_ID),
    },
  },
});
