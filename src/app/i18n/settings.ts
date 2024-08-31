export const fallbackLng = 'en';
export const languages = [fallbackLng, 'ko', 'ja', 'zh', 'th', 'vi'];
export const defaultNS = 'layout';
export const cookieName = 'i18next';

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
});
