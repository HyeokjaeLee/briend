import type { NextRequest } from 'next/server';

import { errors } from 'jose';
import { NextResponse } from 'next/server';
import { random } from 'node-emoji';

import { pusher } from '@/app/pusher/server';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import type { ApiParams, ApiResponse, PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { getAuthToken } from '@/utils/api/getAuthToken';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';

export const POST = createApiRoute<ApiResponse.CREATE_FRIEND>(
  async (req: NextRequest) => {
    const { inviteToken, guestId }: ApiParams.CREATE_FRIEND = await req.json();

    try {
      const { payload } =
        await jwtSecretVerify<Payload.InviteToken>(inviteToken);

      if (guestId === payload.hostId) {
        return NextResponse.json({
          error: 'invalid',
        });
      }

      const token = await getAuthToken({ req });

      await pusher.trigger(
        PUSHER_CHANNEL.WAITING,
        PUSHER_EVENT.WAITING(payload.hostId),
        {
          emoji: token?.email || random().emoji,
          language: payload.guestLanguage,
          nickname: token?.name || payload.guestNickname,
          userId: token?.id || guestId,
        } satisfies PusherType.addFriend,
      );

      return NextResponse.json({
        emoji: payload.hostEmoji,
        language: payload.hostLanguage,
        nickname: payload.hostNickname,
        userId: payload.hostId,
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
