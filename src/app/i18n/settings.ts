import { LANGUAGE } from '@/constants';

export const fallbackLng = LANGUAGE.ENGLISH;
export const languages = [
  fallbackLng,
  LANGUAGE.KOREAN,
  LANGUAGE.JAPANESE,
  LANGUAGE.CHINESE,
  LANGUAGE.THAI,
  LANGUAGE.VIETNAMESE,
];
export const defaultNS = 'layout';

export const getOptions = (
  lng = fallbackLng,
  ns: string | string[] = defaultNS,
) => ({
  supportedLngs: languages,
  fallbackLng,
  lng,
  fallbackNS: defaultNS,
  defaultNS,
  ns,
  react: {
    useSuspense: true, // Suspense 모드 활성화
  },
});
