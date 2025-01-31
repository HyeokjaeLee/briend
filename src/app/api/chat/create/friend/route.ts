import type { NextRequest } from 'next/server';

import { errors } from 'jose';
import { NextResponse } from 'next/server';

import type { ApiParams } from '@/types/api-params';
import type { ApiResponse } from '@/types/api-response';
import type { JwtPayload } from '@/types/jwt';
import { CustomError } from '@/utils';
import {
  createApiRoute,
  createFriendToken,
  getAuthToken,
  jwtSecretVerify,
} from '@/utils/api';

export const POST = createApiRoute<ApiResponse.CREATE_FRIEND>(
  async (req: NextRequest) => {
    const { inviteToken, guestId }: ApiParams.CREATE_FRIEND = await req.json();

    try {
      const { payload } =
        await jwtSecretVerify<JwtPayload.InviteToken>(inviteToken);

      const { hostId } = payload;

      if (guestId === hostId)
        throw new CustomError({
          code: 'UNAUTHORIZED',
          message: 'guestId and hostId are the same',
        });

      const token = await getAuthToken({ req });

      const isGuest = !token?.id;

      const myId = isGuest ? guestId : token.id;

      const [{ friendToken: myToken }, { friendToken: hostToken }] =
        await Promise.all([
          createFriendToken(hostId, {
            language: payload.guestLanguage,
            nickname: payload.guestNickname,
            userId: myId,
            isGuest,
          }),
          createFriendToken(myId, {
            language: payload.hostLanguage,
            nickname: payload.hostNickname,
            userId: hostId,
            isGuest: false,
          }),
        ]);

      return NextResponse.json({
        myToken: myToken,
        friendToken: hostToken,
        friendUserId: hostId,
      });
    } catch (e) {
      if (e instanceof errors.JWTExpired) {
        throw new CustomError({
          code: 'EXPIRED_CHAT',
        });
      }

      throw e;
    }
  },
);
