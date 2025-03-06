import { NextResponse } from 'next/server';

import { assert } from '@/utils';

export interface GetAccountRandomImageRequest {
  userId: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  assert(userId);

  const imageUrl = `https://avatar.iran.liara.run/public?username=${userId}`;

  const res = await fetch(imageUrl);
  const imageBuffer = await res.arrayBuffer();

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'image/png',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
