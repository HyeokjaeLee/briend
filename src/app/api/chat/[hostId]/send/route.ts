import { NextRequest, NextResponse } from 'next/server';

import { format } from '@/utils';
import { pusher } from '@pusher';

import type { DynamicParams } from '../params';

export interface MessageSendRequestParams {
  from: string;
  to: string;
  message: string;
}

export const POST = async (req: NextRequest, { params }: DynamicParams) => {
  const data: MessageSendRequestParams = await req.json();
  const { hostId } = params;
  console.log(data);

  /**
 *   const channel = format.pusherChannel({
    hostId,
    from: data.from,
    to: data.to,
  });

  pusher.trigger(channel, 'send', {});
 */
  return NextResponse.json({ message: 'hello world' });
};

// 채널을 두개로 나눠서 번역 끝난 채팅이 오는 채널과 원본 채널을 특정 대상에게만 보내는 채널로 분리,
