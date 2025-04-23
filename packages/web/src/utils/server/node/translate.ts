import { Translate } from '@google-cloud/translate/build/src/v2';
import * as deepl from 'deepl-node';

import { LANGUAGE } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';

interface TranslateProps {
  message: string;
  targetLanguage: LANGUAGE;
  sourceLanguage: LANGUAGE;
}

const DEEPL_SUPPORTED_SOURCE_LANGUAGES = {
  [LANGUAGE.ENGLISH]: 'en',
  [LANGUAGE.KOREAN]: 'ko',
  [LANGUAGE.JAPANESE]: 'ja',
  [LANGUAGE.CHINESE]: 'zh',
  [LANGUAGE.THAI]: null,
  [LANGUAGE.VIETNAMESE]: null,
} as const;

const DEEPL_SUPPORTED_TARGET_LANGUAGES = {
  ...DEEPL_SUPPORTED_SOURCE_LANGUAGES,
  [LANGUAGE.ENGLISH]: 'en-US',
} as const;

const GOOGLE_SUPPORTED_LANGUAGES = {
  [LANGUAGE.ENGLISH]: 'en',
  [LANGUAGE.KOREAN]: 'ko',
  [LANGUAGE.JAPANESE]: 'ja',
  [LANGUAGE.CHINESE]: 'zh-CN',
  [LANGUAGE.THAI]: 'th',
  [LANGUAGE.VIETNAMESE]: 'vi',
} as const;

const deeplTranslator = new deepl.Translator(PRIVATE_ENV.DEEPL_API_KEY);

// Google Translate 클라이언트 초기화
const googleTranslate = new Translate({
  key: PRIVATE_ENV.GOOGLE_TRANSLATE_API_KEY,
});

export const translate = async ({
  message,
  sourceLanguage,
  targetLanguage,
}: TranslateProps) => {
  if (sourceLanguage === targetLanguage) return message;

  const deeplSourceLanguageCode =
    DEEPL_SUPPORTED_SOURCE_LANGUAGES[sourceLanguage];
  const deeplTargetLanguageCode =
    DEEPL_SUPPORTED_TARGET_LANGUAGES[targetLanguage];

  try {
    if (deeplSourceLanguageCode && deeplTargetLanguageCode) {
      const result = await deeplTranslator.translateText(
        message,
        deeplSourceLanguageCode,
        deeplTargetLanguageCode,
      );

      return result.text;
    }
  } catch (e) {
    console.error(e);
  }

  const [translation] = await googleTranslate.translate(message, {
    from: GOOGLE_SUPPORTED_LANGUAGES[sourceLanguage],
    to: GOOGLE_SUPPORTED_LANGUAGES[targetLanguage],
  });

  return translation;
};
