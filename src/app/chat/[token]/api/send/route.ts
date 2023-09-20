import jwt from 'jsonwebtoken';

import { NextResponse, type NextRequest } from 'next/server';

import { Message } from '@/types';
import { DecodedChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';
import { pusher } from '@pusher';

import type { ApiResponse } from '../ApiResponse';

export const POST = async (req: NextRequest, { params }: ApiResponse) => {
  try {
    const { token } = params;

    const pusherSecret = process.env.PUSHER_SECRET;

    if (!pusherSecret)
      throw new Error('PUSHER_SECRET 환경변수를 찾을 수 없습니다.');

    const decodedToken = jwt.verify(
      token,
      pusherSecret,
    ) as DecodedChattingRoomToken;

    const chattingChannel = naming.chattingChannel(
      decodedToken.hostId,
      decodedToken.guestName,
    );

    const message: Message = await req.json();

    const { meta } = message;

    await pusher.trigger(
      chattingChannel,
      naming.sendingEvent(meta.from, meta.to),
      message,
    );

    return NextResponse.json('success');
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return NextResponse.json('fail', {
        status: 401,
      });
    }

    return NextResponse.json('fail', {
      status: 500,
    });
  }
};
