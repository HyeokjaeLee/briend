import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

import { DecodedChattingRoomToken } from '@/types';
import { chattingChannelName } from '@/utils';
import { pusher } from '@pusher';

interface JoinGuestRequestParams {
  token: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const pusherSecret = process.env.PUSHER_SECRET;
    if (!pusherSecret) {
      return NextResponse.json(
        {},
        {
          status: 500,
          statusText: 'PUSHER_SECRET 환경변수를 찾을 수 없습니다.',
        },
      );
    }

    const data: JoinGuestRequestParams = await req.json();
    const { token } = data;

    const decoded = jwt.verify(token, pusherSecret) as DecodedChattingRoomToken;

    const chattingChannel = chattingChannelName({
      hostId: decoded.hostId,
      guestName: decoded.guestName,
    });

    pusher.trigger(chattingChannel, 'join-channel', token);

    return NextResponse.json(decoded);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        {},
        {
          status: 401,
          statusText: '토큰이 만료되었습니다.',
        },
      );
    }

    return NextResponse.json(
      {},
      {
        status: 500,
      },
    );
  }
};
