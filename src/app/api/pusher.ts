import Pusher from 'pusher';

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;

if (!appId || !key || !secret) throw new Error('Missing PUSHER env variables');

export const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster: 'ap3',
  useTLS: true,
});
