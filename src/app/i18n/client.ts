'use client';

import type { FlatNamespace, KeyPrefix } from 'i18next';

import { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useParams } from 'next/navigation';

import { useLayoutEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import type {
  UseTranslationOptions,
  UseTranslationResponse,
  FallbackNs,
} from 'react-i18next';
import {
  initReactI18next,
  useTranslation as useOriginalTranslation,
} from 'react-i18next';

import { COOKIES } from '@/constants/cookies-key';
import { CustomError, ERROR } from '@/utils/customError';

import { getOptions, languages } from './settings';

const isServer = typeof window === 'undefined';

use(initReactI18next)
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
    preload: isServer ? languages : [],
  });

export const useTranslation = <
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> => {
  const [cookies, setCookie] = useCookies([COOKIES.I18N]);
  const translation = useOriginalTranslation(ns, options);
  const { i18n } = translation;
  const lng = useParams().lng;

  if (typeof lng !== 'string')
    throw new CustomError(ERROR.UNKNOWN_VALUE('lng'));

  if (isServer && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }

  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

  useLayoutEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return;
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage]);

  useLayoutEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return;
    i18n.changeLanguage(lng);
  }, [lng, i18n]);

  useLayoutEffect(() => {
    if (cookies.i18next === lng) return;
    setCookie(COOKIES.I18N, lng, { path: '/' });
  }, [lng, cookies.i18next, setCookie]);

  return translation;
};
