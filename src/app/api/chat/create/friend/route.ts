import type { NextRequest } from 'next/server';

import { errors } from 'jose';
import { NextResponse } from 'next/server';
import { random } from 'node-emoji';

import { pusher } from '@/app/pusher/server';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import type { ApiParams } from '@/types/api-params';
import type { ApiResponse } from '@/types/api-response';
import type { JwtPayload } from '@/types/jwt';
import type { PusherMessage } from '@/types/pusher-message';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { createFriendToken } from '@/utils/api/createFriendToken';
import { getAuthToken } from '@/utils/api/getAuthToken';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR_STATUS } from '@/utils/customError';

export const POST = createApiRoute<ApiResponse.CREATE_FRIEND>(
  async (req: NextRequest) => {
    const { inviteToken, guestId }: ApiParams.CREATE_FRIEND = await req.json();

    try {
      const { payload } =
        await jwtSecretVerify<JwtPayload.InviteToken>(inviteToken);

      const { hostId } = payload;

      if (guestId === hostId)
        throw new CustomError({
          status: ERROR_STATUS.UNAUTHORIZED,
          message: 'guestId and hostId are the same',
        });

      const token = await getAuthToken({ req });

      const isGuest = !token?.id;

      const myId = isGuest ? guestId : token.id;

      const [{ friendToken: myToken }, { friendToken: hostToken }] =
        await Promise.all([
          createFriendToken(hostId, {
            emoji: token?.email || random().emoji,
            language: payload.hostLanguage,
            nickname: payload.hostNickname,
            userId: myId,
            isGuest: false,
          }),
          createFriendToken(myId, {
            emoji: payload.hostEmoji,
            language: payload.hostLanguage,
            nickname: payload.hostNickname,
            userId: hostId,
            isGuest,
          }),
        ]);

      await pusher.trigger(
        PUSHER_CHANNEL.WAITING,
        PUSHER_EVENT.WAITING(payload.hostId),
        {
          userId: myId,
          friendToken: myToken,
        } satisfies PusherMessage.addFriend,
      );

      return NextResponse.json({
        friendToken: hostToken,
        userId: hostId,
      });
    } catch (e) {
      if (e instanceof errors.JWTExpired) {
        throw new CustomError({
          status: ERROR_STATUS.EXPIRED_CHAT,
        });
      }

      throw e;
    }
  },
);
