import type { NextRequest } from 'next/server';

import { errors, jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { pusher } from '@/app/pusher/server';
import { CHANNEL } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { PRIVATE_ENV } from '@/constants/private-env';
import { ROUTES } from '@/routes/client';
import type { PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { setUserIdCookie } from '@/utils/api/setUserIdCookie';

export const GET = createApiRoute(async (req: NextRequest) => {
  const inviteToken = req.nextUrl.searchParams.get('inviteToken');

  if (!inviteToken) {
    req.nextUrl.pathname = ROUTES.CHATTING_LIST.pathname;

    return NextResponse.redirect(req.nextUrl);
  }

  try {
    const { payload } = await jwtVerify<Payload.InviteToken>(
      inviteToken,
      new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET),
    );

    const channelId = nanoid();

    const redirect = NextResponse.redirect(
      ROUTES.CHATTING_ROOM.url({
        searchParams: { channelId },
        lng: payload.language,
      }),
    );

    const guestId = setUserIdCookie(req, redirect);

    const channelToken = await new SignJWT({
      channelId,
      hostId: payload.hostId,
      guestId,
    } satisfies Payload.ChannelToken)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));

    await pusher.trigger(CHANNEL.WAITING, payload.hostId, {
      channelToken,
    } satisfies PusherType.joinChat);

    redirect.cookies.set(`${COOKIES.CHANNEL_PREFIX}${channelId}`, channelToken);

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

    console.error(e);

    req.nextUrl.pathname = ROUTES.CHATTING_LIST.pathname;

    return NextResponse.redirect(req.nextUrl);
  }
});
