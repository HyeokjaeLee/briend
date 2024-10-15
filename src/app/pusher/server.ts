import Pusher from 'pusher';

import { PRIVATE_ENV } from '@/constants/private-env';
import { PUBLIC_ENV } from '@/constants/public-env';

export const pusher = new Pusher({
  appId: PRIVATE_ENV.PUSHER_APP_ID,
  key: PUBLIC_ENV.PUSHER_KEY,
  secret: PRIVATE_ENV.PUSHER_SECRET,
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
});
