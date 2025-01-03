import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { COOKIES, LANGUAGE } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams } from '@/types/api-params';
import type { ApiResponse } from '@/types/api-response';
import type { JwtPayload } from '@/types/jwt';
import { CustomError, ERROR, isEnumValue } from '@/utils';
import { createApiRoute, getAuthToken } from '@/utils/api';

export const POST = createApiRoute<ApiResponse.CREATE_CHAT_INVITE_TOKEN>(
  async (req: NextRequest) => {
    const {
      guestNickname,
      guestLanguage,
      hostId,
    }: ApiParams.CREATE_CHAT_INVITE_TOKEN = await req.json();

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
      guestNickname,
      guestLanguage,
      hostLanguage,
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
