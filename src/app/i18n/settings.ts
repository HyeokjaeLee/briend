export const fallbackLng = 'en';
export const languages = [fallbackLng, 'ko', 'ja', 'zh', 'th', 'vi'];
export const defaultNS = 'translation';
export const cookieName = 'i18n_lng';

export const getOptions = (lng: string, ns: string | string[]) => ({
  supportedLngs: languages,
  fallbackLng,
  lng,
  fallbackNS: defaultNS,
  defaultNS,
  ns,
});
