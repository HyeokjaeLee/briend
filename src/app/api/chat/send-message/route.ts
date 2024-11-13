import { errors } from 'jose';
import { nanoid } from 'nanoid';
import { NextResponse, type NextRequest } from 'next/server';

import { pusher } from '@/app/pusher/server';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import type { ApiParams, ApiResponse, PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';

export const POST = createApiRoute<ApiResponse.SEND_MESSAGE>(
  async (req: NextRequest) => {
    const { channelToken, message, toUserId }: ApiParams.SEND_MESSAGE =
      await req.json();

    try {
      const { payload } =
        await jwtSecretVerify<Payload.ChannelToken>(channelToken);

      const id = nanoid();

      await pusher.trigger(
        PUSHER_CHANNEL.CHATTING(payload.hostId),
        PUSHER_EVENT.CHATTING_SEND_MESSAGE(payload.channelId, toUserId),
        {
          message,
          id,
        } satisfies PusherType.sendMessage,
      );

      return NextResponse.json({
        id,
      } satisfies ApiResponse.SEND_MESSAGE);
    } catch (e) {
      if (e instanceof errors.JWTExpired)
        return NextResponse.json(
          {
            id: '',
          },
          {
            status: 401,
          },
        );

      return NextResponse.json(
        {
          id: '',
        },
        { status: 500 },
      );
    }
  },
);
