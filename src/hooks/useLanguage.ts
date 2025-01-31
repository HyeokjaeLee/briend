import { useParams } from 'next/navigation';

import { COOKIES, LANGUAGE } from '@/constants';
import { assertEnum } from '@/utils';

import { useCookies } from './useCookies';

export const useLanguage = () => {
  const { lng: paramsLng } = useParams();

  const [{ i18n: cookieLng }] = useCookies([COOKIES.I18N]);

  const lng = paramsLng || cookieLng;

  assertEnum(LANGUAGE, lng);

  let dayjsLocale: string = lng;

  if (lng === 'zh') dayjsLocale = 'zh-cn';

  return {
    lng,
    dayjsLocale,
  };
};
