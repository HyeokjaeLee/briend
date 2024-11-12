import type { ChannelAuthResponse } from 'pusher';

import { NextResponse } from 'next/server';

import { pusher } from '@/app/pusher/server';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { CustomError, ERROR } from '@/utils/customError';

export const POST = createApiRoute<ChannelAuthResponse>(async (req) => {
  const formData = await req.formData();

  const socket_id = formData.get('socket_id');
  const channel_name = formData.get('channel_name');
  const user_id = formData.get('user_id');

  if (
    typeof socket_id !== 'string' ||
    typeof channel_name !== 'string' ||
    typeof user_id !== 'string'
  )
    throw new CustomError(ERROR.UNAUTHORIZED());

  const auth = pusher.authorizeChannel(socket_id, channel_name, {
    user_id,
  });

  return NextResponse.json(auth);
});
