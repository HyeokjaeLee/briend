import { useParams } from 'next/navigation';

import { COOKIES, LANGUAGE } from '@/constants';
import { assertEnum, customCookies } from '@/utils';

export const useLanguage = () => {
  const { lng: paramsLng } = useParams();

  const cookieLng = customCookies.get(COOKIES.I18N);

  const lng = paramsLng || cookieLng;

  assertEnum(LANGUAGE, lng);

  let dayjsLocale: string = lng;

  if (lng === 'zh') dayjsLocale = 'zh-cn';

  return {
    lng,
    dayjsLocale,
  };
};
