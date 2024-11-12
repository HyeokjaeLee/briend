import { Translator } from 'deepl-node';
import { errors } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

import { pusher } from '@/app/pusher/server';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { PRIVATE_ENV } from '@/constants/private-env';
import type { ApiParams, ApiResponse, PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { createApiRoute } from '@/utils/api/createApiRoute';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR } from '@/utils/customError';
import { isEnumValue } from '@/utils/isEnumValue';

const translatorWithDeepL = new Translator(PRIVATE_ENV.DEEPL_API_KEY);

export const POST = createApiRoute<ApiResponse.RECEIVE_MESSAGE>(
  async (req: NextRequest) => {
    const { channelToken, message, id }: ApiParams.RECEIVE_MESSAGE =
      await req.json();

    const i18n = req.cookies.get(COOKIES.I18N)?.value;
    const userId = req.cookies.get(COOKIES.USER_ID)?.value;

    if (!userId) throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['userId']));

    if (!isEnumValue(LANGUAGE, i18n))
      throw new CustomError(ERROR.UNKNOWN_VALUE('i18n'));

    try {
      const { payload } =
        await jwtSecretVerify<Payload.ChannelToken>(channelToken);

      const { text: translatedMessage } =
        await translatorWithDeepL.translateText(
          message,
          null,
          {
            [LANGUAGE.ENGLISH]: 'en-US' as const,
            [LANGUAGE.KOREAN]: 'ko' as const,
            [LANGUAGE.JAPANESE]: 'ja' as const,
            [LANGUAGE.CHINESE]: 'zh' as const,
            [LANGUAGE.THAI]: 'lt' as const, //GOOGLE
            [LANGUAGE.VIETNAMESE]: 'lt' as const, //GOOGLE
          }[i18n],
        );

      console.log({
        translatedMessage,
        id,
        userId,
      });

      await pusher.trigger(
        PUSHER_CHANNEL.CHATTING(payload.hostId, payload.channelId),
        PUSHER_EVENT.CHATTING_RECEIVE_MESSAGE,
        {
          translatedMessage,
          id,
          userId,
        } satisfies PusherType.receiveMessage,
      );

      return NextResponse.json({
        id,
      } satisfies ApiResponse.SEND_MESSAGE);
    } catch (e) {
      if (e instanceof errors.JWTExpired)
        return NextResponse.json(
          { id },
          {
            status: 401,
          },
        );
    }

    return NextResponse.json(
      { id },
      {
        status: 500,
      },
    );
  },
);
