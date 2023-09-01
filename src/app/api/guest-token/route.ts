import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

export interface GetGuestQrRequestParams {
  hostId: string;
  guestName: string;
  guestLanguage: string;
}

export interface GetGuestQrResponse {
  token: string | null;
}

const errorResponse: GetGuestQrResponse = {
  token: null,
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const hostId = searchParams.get('hostId');
    const guestName = searchParams.get('guestName');
    const guestLanguage = searchParams.get('guestLanguage');

    if (hostId && guestName && guestLanguage) {
      const { PUSHER_SECRET } = process.env;
      if (PUSHER_SECRET) {
        const token = jwt.sign(
          {
            hostId,
            guestName,
            guestLanguage,
          } satisfies GetGuestQrRequestParams,
          PUSHER_SECRET,
          {
            expiresIn: '12h',
          },
        );

        return NextResponse.json({
          token,
        } satisfies GetGuestQrResponse);
      }

      return NextResponse.json(errorResponse, {
        status: 500,
        statusText: 'PUSHER_SECRET 환경변수를 찾을 수 없습니다.',
      });
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      statusText: 'Guest 토큰 발급에 필요한 정보가 부족합니다.',
    });
  } catch (e) {
    return NextResponse.json(errorResponse, {
      status: 500,
      statusText: 'Guest 토큰을 발급 받지 못했습니다.',
    });
  }
};
