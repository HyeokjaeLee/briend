import type { i18n, TFunction } from 'i18next';

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useParams } from 'next/navigation';

import { useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { getOptions } from './settings';

const initI18next = async (
  lng: string,
  ns: string | string[],
): Promise<i18n> => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(lng, ns));

  return i18nInstance;
};

export const getTranslation = async (
  lng: string,
  ns: string | string[],
  options: { keyPrefix?: string } = {},
) => {
  const i18nextInstance = await initI18next(lng, ns);

  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix,
    ),
    i18n: i18nextInstance,
  };
};

export const useTranslation = (ns: string | string[]) => {
  const params = useParams();

  const [translation, setTranslation] = useState<{
    t: (() => string) | TFunction<string, string>;
    i18n: i18n;
  }>({
    t: () => '',
    i18n: createInstance(),
  });

  useEffect(() => {
    if (typeof params.lng !== 'string')
      throw new Error(
        'Invalid lng parameter. Please provide a valid language code.',
      );

    getTranslation(params.lng, ns).then(setTranslation);
  }, [ns, params.lng]);

  return translation;
};
