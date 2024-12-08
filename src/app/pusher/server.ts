import Pusher from 'pusher';

import { ENV } from '@/constants/env';

export const pusher = new Pusher({
  appId: ENV.PUSHER_APP_ID,
  key: ENV.PUSHER_KEY,
  secret: ENV.PUSHER_SECRET,
  cluster: ENV.PUSHER_CLUSTER,
});
