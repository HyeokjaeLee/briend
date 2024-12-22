import Pusher from 'pusher';

import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';

export const pusher = new Pusher({
  appId: PRIVATE_ENV.PUSHER_APP_ID,
  key: PUBLIC_ENV.PUSHER_KEY,
  secret: PRIVATE_ENV.PUSHER_SECRET,
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
});
