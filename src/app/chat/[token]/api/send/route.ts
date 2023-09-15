import { NextResponse, type NextRequest } from 'next/server';

import { Message } from '@/types';
import { decodeChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';
import { pusher } from '@pusher';

import type { ApiResponse } from '../ApiResponse';

export const POST = async (req: NextRequest, { params }: ApiResponse) => {
  try {
    const { token } = params;
    const decodedToken = decodeChattingRoomToken(token);

    if (!decodedToken) {
      return NextResponse.json('fail', {
        status: 400,
        statusText: '잘못된 토큰입니다.',
      });
    }

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
    return NextResponse.json('fail', {
      status: 500,
      statusText: String(e),
    });
  }
};
