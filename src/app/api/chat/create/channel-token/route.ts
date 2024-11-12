import type { NextRequest } from 'next/server';

import { errors, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { random } from 'node-emoji';

import { pusher } from '@/app/pusher/server';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams, ApiResponse, PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';

export const POST = createApiRoute<ApiResponse.CREATE_CHAT_CHANNEL_TOKEN>(
  async (req: NextRequest) => {
    const { inviteToken, guestId }: ApiParams.CREATE_CHAT_CHANNEL_TOKEN =
      await req.json();

    try {
      const { payload } =
        await jwtSecretVerify<Payload.InviteToken>(inviteToken);

      if (guestId === payload.hostId) {
        return NextResponse.json({
          error: 'invalid',
        });
      }

      const channelId = nanoid();

      const channelToken = await new SignJWT({
        channelId,
        hostId: payload.hostId,
        hostNickname: payload.hostNickname,
        guestId,
        guestNickname: payload.guestNickname,
        guestEmoji: random().emoji,
        hostEmoji: payload.hostEmoji,
      } satisfies Payload.ChannelToken)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));

      await pusher.trigger(
        PUSHER_CHANNEL.WAITING,
        PUSHER_EVENT.WAITING(payload.hostId),
        {
          channelToken,
        } satisfies PusherType.joinChat,
      );

      return NextResponse.json({
        channelId,
        channelToken,
      });
    } catch (e) {
      if (e instanceof errors.JWTExpired) {
        return NextResponse.json({
          error: 'expired',
        });
      }

      return NextResponse.json({
        error: 'invalid',
      });
    }
  },
);
