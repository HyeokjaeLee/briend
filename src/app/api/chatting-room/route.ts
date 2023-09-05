import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

import { LANGUAGE } from '@/constants';
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

    if (!pusherSecret) {
      return NextResponse.json(errorResponse, {
        status: 500,
        statusText: 'PUSHER_SECRET 환경변수를 찾을 수 없습니다.',
      });
    }

    if (!hostId || !guestName || !hostName) {
      return NextResponse.json(errorResponse, {
        status: 400,
        statusText: 'guest token 발급에 필요한 정보가 부족합니다.',
      });
    }

    if (!guestLanguage || !typeGuard.isLanguage(guestLanguage)) {
      return NextResponse.json(errorResponse, {
        status: 400,
        statusText: 'guestLanguage가 올바르지 않습니다.',
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
      statusText: 'Guest 토큰을 발급 받지 못했습니다.',
    });
  }
};
