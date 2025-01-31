'use client';

import type { FlatNamespace, KeyPrefix } from 'i18next';

import { use as i18next } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

import { use, useLayoutEffect } from 'react';
import type {
  UseTranslationOptions,
  UseTranslationResponse,
  FallbackNs,
} from 'react-i18next';
import {
  initReactI18next,
  useTranslation as useOriginalTranslation,
} from 'react-i18next';

import { IS_CLIENT } from '@/constants';
import { useLanguage } from '@/hooks';

import { getOptions, languages } from './settings';

const i18nInstance = i18next(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: IS_CLIENT ? [] : languages,
  });

export const useTranslation = <
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> => {
  use(i18nInstance);

  const { lng } = useLanguage();

  const translation = useOriginalTranslation(ns, options);

  const { i18n } = translation;

  if (!IS_CLIENT && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }

  useLayoutEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return;

    i18n.changeLanguage(lng);
  }, [lng, i18n]);

  return translation;
};
