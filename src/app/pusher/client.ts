import Pusher from 'pusher-js';

import { PUBLIC_ENV } from '@/constants/public-env';

export const pusher = new Pusher(PUBLIC_ENV.PUSHER_KEY, {
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
});
