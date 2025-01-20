import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { COOKIES, LANGUAGE } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';
import type { JwtPayload } from '@/types/jwt';
import { CustomError, ERROR, isEnumValue } from '@/utils';
import { createApiRoute, getAuthToken } from '@/utils/api';

export type CreateChatInviteTokenApiParams = Pick<
  JwtPayload.InviteToken,
  'hostId' | 'guestLanguage' | 'guestNickname'
>;

export interface CreateChatInviteTokenApiResponse {
  inviteToken: string;
}

export const POST = createApiRoute<CreateChatInviteTokenApiResponse>(
  async (req: NextRequest) => {
    const {
      guestNickname,
      guestLanguage,
      hostId,
    }: CreateChatInviteTokenApiParams = await req.json();

    const token = await getAuthToken({ req });

    const hostNickname = token?.name;

    if (!hostNickname)
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['hostNickname']));

    const i18nCookie = req.cookies.get(COOKIES.I18N);

    const hostLanguage = i18nCookie?.value;

    if (!isEnumValue(LANGUAGE, hostLanguage))
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['hostLanguage']));

    const inviteToken = await new SignJWT({
      hostId,
      hostNickname,
      hostLanguage,
      guestNickname,
      guestLanguage,
    } satisfies JwtPayload.InviteToken)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET));

    return NextResponse.json({
      inviteToken,
    });
  },
  {
    auth: true,
  },
);
