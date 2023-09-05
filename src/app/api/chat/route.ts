import { NextRequest, NextResponse } from 'next/server';

import { LANGUAGE } from '@/constants';
import { pusher } from '@pusher';

export interface Message {
  user: string;
  message: {
    original: string;
    translated: string;
  };
}

export const POST = async (req: NextRequest) => {
  console.log('message/route.ts');
  return NextResponse.json({ message: 'hello world' });
};

/**
 *   const data: Message = await req.json();

  const id = req.headers.get('id');

  if (id) {
    pusher.trigger(id, 'my-event', {
      message: data.message,
    });
  }

 pusher.trigger('message', 'my-event', {
    message: 'hello world',
  });


  return NextResponse.json(data);
 */
