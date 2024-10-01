import type { InviteTokenPayload } from '../chat/create/route';
import type { NextRequest } from 'next/server';

import { errors, jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { pusher } from '@/app/pusher/server';
import { CHANNEL } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { SECRET_ENV } from '@/constants/secret-env';
import { ROUTES } from '@/routes/client';
import { createApiRoute } from '@/utils/createApiRoute';
import { setUserIdCookie } from '@/utils/setUserIdCookie';

export const GET = createApiRoute(async (req: NextRequest) => {
  const inviteToken = req.nextUrl.searchParams.get('inviteToken');

  if (!inviteToken) {
    req.nextUrl.pathname = ROUTES.CHATTING_LIST.pathname;

    return NextResponse.redirect(req.nextUrl);
  }

  try {
    const { payload } = await jwtVerify<InviteTokenPayload>(
      inviteToken,
      new TextEncoder().encode(SECRET_ENV.AUTH_SECRET),
    );

    const channelId = COOKIES.CHANNEL_PREFIX + nanoid();

    const redirect = NextResponse.redirect(
      ROUTES.CHATTING_ROOM.url({
        searchParams: { channelId },
      }),
    );

    const guestId = setUserIdCookie(req, redirect);

    const channelToken = await new SignJWT({
      channelId,
      hostId: payload.hostId,
      guestId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(SECRET_ENV.AUTH_SECRET));

    await pusher.trigger(CHANNEL.WAITING, payload.hostId, {
      channelToken,
    });

    redirect.cookies.set(
      `${COOKIES.CHANNEL_PREFIX}${channelId}`,
      payload.hostId,
    );

    return redirect;
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
      const { payload } = e;

      req.nextUrl.pathname = ROUTES.EXPIRED_CHAT.pathname;

      if ('language' in payload && typeof payload.language === 'string') {
        req.nextUrl.pathname = `/${payload.language}` + req.nextUrl.pathname;
      }

      return NextResponse.redirect(req.nextUrl);
    }

    req.nextUrl.pathname = ROUTES.CHATTING_LIST.pathname;

    return NextResponse.redirect(req.nextUrl);
  }
});
