import axios from 'axios';

import { LANGUAGE } from '@/constants';
import { SocketApiHander } from '@/types';

export interface Chatting {
  user: string;
  message: {
    [LANGUAGE.ENGLISH]?: string;
    [LANGUAGE.JAPANESE]?: string;
    [LANGUAGE.KOREAN]?: string;
  };
  language: LANGUAGE;
}

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

const chat: SocketApiHander = async (req, res) => {
  try {
    const { roomsMap } = res.socket.server;
    const { authorization } = req.headers;

    if (req.method === 'POST') {
      if (roomsMap && authorization) {
        const { room } = roomsMap.get(authorization) ?? {};

        if (room) {
          const chatting: Chatting = req.body;
          const originalMessage = chatting.message[chatting.language];
          const targetLanguageList = Object.values(LANGUAGE).filter(
            (value) => value !== chatting.language,
          );

          const deeplResponse: DeepLResponse[] = await Promise.all(
            targetLanguageList.map((targetLanguage) =>
              axios.post(
                'https://api-free.deepl.com/v2/translate',
                {
                  text: [originalMessage],
                  target_lang: targetLanguage,
                },
                {
                  headers: {
                    Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
                    'User-Agent': 'YourApp/1.2.3',
                    'Content-Type': 'application/json',
                  },
                },
              ),
            ),
          );

          deeplResponse.forEach(
            (
              {
                data: {
                  translations: [result],
                },
              },
              index,
            ) => {
              chatting.message[targetLanguageList[index]] = result.text;
            },
          );

          room.emit('message', chatting);
          res.status(201).send('ok');
        } else throw new Error("Can't find room");
      } else throw new Error("Can't find roomMap");
    } else throw new Error('Invalid method');
  } catch (e) {
    res.status(500).send(String(e));
  }
};

export default chat;
