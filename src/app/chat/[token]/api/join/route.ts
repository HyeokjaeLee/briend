import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

import { CHANNEL_EVENT } from '@/constants';
import type { DecodedChattingRoomToken } from '@/types';
import { naming } from '@/utils/naming';
import { pusher } from '@pusher';

interface Response {
  params: {
    token: string;
  };
}

export interface JoinPostParams {
  isHost: boolean;
}

export interface JoinPusherResponse {
  token: string;
  isHost: boolean;
}

export const POST = async (req: NextRequest, { params }: Response) => {
  try {
    const { isHost }: JoinPostParams = await req.json();

    const { token } = params;

    const pusherSecret = process.env.PUSHER_SECRET;

    if (!pusherSecret) {
      return NextResponse.json('fail', {
        status: 500,
        statusText: 'PUSHER_SECRET 환경변수를 찾을 수 없습니다.',
      });
    }

    const decoded = jwt.verify(token, pusherSecret) as DecodedChattingRoomToken;

    const chattingChannel = naming.chattingChannel(
      decoded.hostId,
      decoded.guestName,
    );

    pusher.trigger(chattingChannel, CHANNEL_EVENT.JOIN_CHANNEL, {
      token,
      isHost,
    });

    return NextResponse.json('success');
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return NextResponse.json('fail', {
        status: 401,
        statusText: '토큰이 만료되었습니다.',
      });
    }

    console.log(e);

    return NextResponse.json('fail', {
      status: 500,
    });
  }
};
