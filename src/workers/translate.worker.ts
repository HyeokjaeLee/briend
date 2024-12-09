import type { Translator, TranslateMessage } from './translate.type';

import { pipeline } from '@xenova/transformers';

let translator: Translator;

self.onmessage = async (event: MessageEvent<TranslateMessage.Request>) => {
  const { type, text, sourceLang, targetLang } = event.data;

  if (type === 'init') {
    translator = await pipeline(
      'translation',
      'Xenova/nllb-200-distilled-600M',
    );
    self.postMessage({
      type: 'ready',
      text: '',
    } satisfies TranslateMessage.Response);
  }

  if (type === 'translate' && translator) {
    const [{ translation_text }] = await translator(text, {
      src_lang: sourceLang,
      tgt_lang: targetLang,
    });

    if (translation_text) {
      self.postMessage({
        type: 'translate',
        text: translation_text,
      } satisfies TranslateMessage.Response);
    } else {
      self.postMessage({
        type: 'error',
        text: 'Translation failed',
      } satisfies TranslateMessage.Response);
    }
  }
};
