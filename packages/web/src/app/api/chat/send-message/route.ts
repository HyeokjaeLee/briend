import { Translator } from 'deepl-node';
import { errors } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { LANGUAGE } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';
import type * as ApiParams from '@/types/api-params';
import type * as JwtPayload from '@/types/jwt';
import { isArrayItem } from '@/utils';
import { createApiRoute, jwtSecretVerify } from '@/utils/api';

const translatorWithDeepL = new Translator(PRIVATE_ENV.DEEPL_API_KEY);

const fromLanguageObject = {
  [LANGUAGE.ENGLISH]: 'en',
  [LANGUAGE.KOREAN]: 'ko',
  [LANGUAGE.JAPANESE]: 'ja',
  [LANGUAGE.CHINESE]: 'zh',
} as const;

const toLanguageObject = {
  ...fromLanguageObject,
  [LANGUAGE.ENGLISH]: 'en-US',
} as const;

const DEEPL_LANGUAGE = [
  LANGUAGE.ENGLISH,
  LANGUAGE.KOREAN,
  LANGUAGE.JAPANESE,
  LANGUAGE.CHINESE,
] as const;

export const POST = createApiRoute(async (req: NextRequest) => {
  const { channelToken, message, fromUserId, id }: ApiParams.SEND_MESSAGE =
    await req.json();

  try {
    const { payload } =
      await jwtSecretVerify<JwtPayload.ChannelToken>(channelToken);

    const [fromLanguage, toLanguage] =
      payload.hostId === fromUserId
        ? [payload.hostLanguage, payload.guestLanguage]
        : [payload.guestLanguage, payload.hostLanguage];

    let translatedMessage: string;

    if (
      isArrayItem(DEEPL_LANGUAGE, fromLanguage) &&
      isArrayItem(DEEPL_LANGUAGE, toLanguage)
    ) {
      const { text } = await translatorWithDeepL.translateText(
        message,
        fromLanguageObject[fromLanguage],
        toLanguageObject[toLanguage],
      );

      translatedMessage = text;
    } else {
      //TODO: GOOGLE TRANSLATE
      translatedMessage = message;
    }

    console.info(translatedMessage, id);

    return new NextResponse(null, { status: 200 });
  } catch (e) {
    return new NextResponse(null, {
      status: e instanceof errors.JWTExpired ? 401 : 500,
    });
  }
});
