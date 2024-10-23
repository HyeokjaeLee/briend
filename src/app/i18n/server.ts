import type { FlatNamespace, KeyPrefix } from 'i18next';

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

import type { FallbackNs } from 'react-i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

import type { LANGUAGE } from '@/constants/language';

import { getOptions } from './settings';

const initI18next = async (lng: LANGUAGE, ns: string | string[]) => {
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

export const getTranslation = async <
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns: Ns,
  lng: LANGUAGE,
  options: { keyPrefix?: KPrefix; onlyDisplay?: boolean } = {},
) => {
  const i18nextInstance = await initI18next(
    lng,
    Array.isArray(ns) ? (ns as string[]) : (ns as string),
  );

  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
};
