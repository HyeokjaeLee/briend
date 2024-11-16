import { SignJWT } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams, ApiResponse } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { getAuthToken } from '@/utils/api/getAuthToken';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';

export const POST = createApiRoute<ApiResponse.CREATE_CHAT_INVITE_TOKEN>(
  async (req: NextRequest) => {
    const {
      guestNickname,
      guestLanguage,
      hostId,
      hostEmoji,
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
      hostEmoji,
      guestNickname,
      guestLanguage,
      hostLanguage,
    } satisfies Payload.InviteToken)
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
