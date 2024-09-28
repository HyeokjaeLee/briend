import Pusher from 'pusher';

import { PUBLIC_ENV } from '@/constants/public-env';
import { SECRET_ENV } from '@/constants/secret-env';

export const pusher = new Pusher({
  appId: SECRET_ENV.PUSHER_APP_ID,
  key: PUBLIC_ENV.PUSHER_KEY,
  secret: SECRET_ENV.PUSHER_SECRET,
  cluster: PUBLIC_ENV.PUSHER_CLUSTER,
});
