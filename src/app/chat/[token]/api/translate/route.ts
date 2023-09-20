import axios from 'axios';

import { NextResponse, type NextRequest } from 'next/server';

import { CHANNEL_EVENT, LANGUAGE } from '@/constants';
import { Message } from '@/types';
import { decodeChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';
import { pusher } from '@pusher';

import type { ApiResponse } from '../ApiResponse';

const POST_URL = 'https://api-free.deepl.com/v2/translate';

const POST_HEADERS = {
  Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
  'User-Agent': 'YourApp/1.2.3',
  'Content-Type': 'application/json',
};

interface DeepLResponse {
  data: {
    translations: [
      {
        detected_source_language: LANGUAGE;
        text: string;
      },
    ];
  };
}

const postDeepL = async (
  sourceLanguage: LANGUAGE,
  targetLanguage: LANGUAGE,

  text?: string,
) => {
  try {
    if (!text) return '';
    const response: DeepLResponse = await axios.post(
      POST_URL,
      {
        text: [text],
        source_lang: sourceLanguage,
        target_lang: targetLanguage,
      },
      {
        headers: POST_HEADERS,
      },
    );

    const translatedText = response.data.translations[0].text;

    return translatedText;
  } catch {
    return null;
  }
};

export const POST = async (req: NextRequest, { params }: ApiResponse) => {
  try {
    const { token } = params;

    const decodedToken = decodeChattingRoomToken(token);

    if (!decodedToken) {
      return NextResponse.json('fail', {
        status: 400,
        statusText: '잘못된 토큰입니다.',
      });
    }

    const { hostId, guestName, guestLanguage } = decodedToken;

    const chattingChannel = naming.chattingChannel(hostId, guestName);

    const { meta, message }: Message = await req.json();

    const [userLanguage, opponentLanguage] = message.KO
      ? [LANGUAGE.KOREAN, guestLanguage]
      : [guestLanguage, LANGUAGE.KOREAN];

    const translatedText = await postDeepL(
      userLanguage,
      opponentLanguage,
      message[userLanguage],
    );

    const translatedMessage: Message = {
      meta,
      message: translatedText
        ? {
            ...message,
            [opponentLanguage]: translatedText,
          }
        : message,
    };

    await pusher.trigger(
      chattingChannel,
      CHANNEL_EVENT.TRANSLATE,
      translatedMessage,
    );

    return NextResponse.json('success');
  } catch (e) {
    return NextResponse.json('fail', {
      status: 500,
    });
  }
};
