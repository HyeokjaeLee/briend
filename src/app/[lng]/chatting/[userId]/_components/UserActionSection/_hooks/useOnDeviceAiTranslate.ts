import { debounce } from 'es-toolkit';

import { useEffect, useMemo, useState } from 'react';

import type { LANGUAGE } from '@/constants/language';
import { LANGUAGE_CODE, type TranslateMessage } from '@/workers/translate.type';

interface UseOnDeviceAiTranslateProps {
  onTranslate?: (text: string) => void;
}

interface TranslateOptions {
  sourceLang: LANGUAGE;
  targetLang: LANGUAGE;
}

export const useOnDeviceAiTranslate = ({
  onTranslate,
}: UseOnDeviceAiTranslateProps) => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const translateWorker = new Worker(
      new URL('@/workers/translate.worker.ts', import.meta.url),
    );

    translateWorker.postMessage({
      type: 'init',
      text: '',
      sourceLang: '',
      targetLang: '',
    } satisfies TranslateMessage.Request);

    translateWorker.onmessage = (
      event: MessageEvent<TranslateMessage.Response>,
    ) => {
      const { type, text } = event.data;
      switch (type) {
        case 'translate':
          onTranslate?.(text);
          break;
        case 'ready':
          setWorker(translateWorker);
          break;

        case 'error':
          //TODO: 에러에 대한 예외처리 필요
          break;
      }
    };
  }, [onTranslate]);

  const translate = useMemo(() => {
    if (!worker) return;

    return debounce((text: string, options: TranslateOptions) => {
      worker.postMessage({
        type: 'translate',
        text,
        sourceLang: LANGUAGE_CODE[options.sourceLang],
        targetLang: LANGUAGE_CODE[options.targetLang],
      });
    }, 3_000);
  }, [worker]);

  return { isLoading: !!worker, translate };
};
