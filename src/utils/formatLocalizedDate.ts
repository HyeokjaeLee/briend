import type { Dayjs } from 'dayjs';

import { extend } from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { LANGUAGE } from '@/constants';

interface DateFormatOptions {
  day?: boolean;
  withYear?: boolean;
  time?: boolean;
}

export const formatLocalizedDate = (
  date: Dayjs,
  lng: LANGUAGE,
  options: DateFormatOptions = {},
) => {
  const dayjsLocale: string = lng;

  const localeDate = date.locale(dayjsLocale);

  const { day, withYear, time } = options;

  if (lng === LANGUAGE.THAI) {
    extend(buddhistEra);

    const formatList: string[] = [];

    if (day) {
      formatList.push('D MMMM');

      if (withYear) formatList.push('BBBB');
    }

    if (time) formatList.push('HH:mm น.');

    if (formatList.length === 0) return '';

    return localeDate.format(formatList.join(' '));
  }

  extend(localizedFormat);

  if (!day) {
    if (time) return localeDate.format('A h:mm');

    return '';
  }

  if (time && withYear) return localeDate.format('lll');

  if (withYear) return localeDate.format('ll');

  switch (lng) {
    case LANGUAGE.KOREAN:
      return localeDate.format('M월 d일');
    case LANGUAGE.JAPANESE:
    case LANGUAGE.CHINESE:
      return localeDate.format('M月 d日');

    case LANGUAGE.VIETNAMESE:
      return localeDate.format('M/d/yyyy');
  }
};
