import { useParams } from 'next/navigation';

import { LANGUAGE } from '@/constants';
import { CustomError, ERROR, isEnumValue } from '@/utils';

export const useLanguage = () => {
  const { lng } = useParams();

  if (!isEnumValue(LANGUAGE, lng))
    throw new CustomError(ERROR.UNKNOWN_VALUE('lng'));

  let dayjsLocale: string = lng;

  if (lng === 'zh') dayjsLocale = 'zh-cn';

  return {
    lng,
    dayjsLocale,
  };
};
