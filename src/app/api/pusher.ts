import Pusher from 'pusher';

const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET } = process.env;

if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET)
  throw new Error('Missing PUSHER env variables');

export const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: 'ap3',
  useTLS: true,
});
