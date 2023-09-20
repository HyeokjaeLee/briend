import jwt from 'jsonwebtoken';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import type { LANGUAGE } from '@/constants';
import { typeGuard } from '@/utils';

export interface SignChattingRoomTokenParams {
  hostId: string;
  hostName: string;
  guestName: string;
  guestLanguage: LANGUAGE;
}

export interface SignChattingRoomTokenRespons {
  token: string | null;
}

const errorResponse: SignChattingRoomTokenRespons = {
  token: null,
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const hostId = searchParams.get('hostId');
    const hostName = searchParams.get('hostName');
    const guestName = searchParams.get('guestName');
    const guestLanguage = searchParams.get('guestLanguage');

    const pusherSecret = process.env.PUSHER_SECRET;

    if (!pusherSecret)
      throw new Error('PUSHER_SECRET 환경변수를 찾을 수 없습니다.');

    if (!hostId || !guestName || !hostName) {
      return NextResponse.json(errorResponse, {
        status: 400,
        statusText: 'not enough params to sign token',
      });
    }

    if (!guestLanguage || !typeGuard.isLanguage(guestLanguage)) {
      return NextResponse.json(errorResponse, {
        status: 400,
        statusText: 'invalid guest language',
      });
    }

    const token = jwt.sign(
      {
        hostId,
        guestName,
        hostName,
        guestLanguage,
      } satisfies SignChattingRoomTokenParams,
      pusherSecret,
      {
        expiresIn: '12h',
      },
    );

    return NextResponse.json({
      token,
    } satisfies SignChattingRoomTokenRespons);
  } catch (e) {
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
};
