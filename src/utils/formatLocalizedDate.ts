import type { Dayjs } from 'dayjs';

import { extend } from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

import { LANGUAGE } from '@/constants';

interface DateFormatOptions {
  day?: boolean;
  year?: boolean;
  time?: boolean;
}

export const formatLocalizedDate = (
  date: Dayjs,
  lng: LANGUAGE,
  options: DateFormatOptions = {},
) => {
  const dayjsLocale: string = lng;

  const localeDate = date.locale(dayjsLocale);

  const { year, day, time } = options;

  const timeFormat: (string | null)[] = [null, null, null];

  if (time)
    switch (lng) {
      case LANGUAGE.KOREAN:
        timeFormat[2] = 'A h:mm';
        break;
      case LANGUAGE.JAPANESE:
      case LANGUAGE.CHINESE:
        timeFormat[2] = 'A h:mm';
        break;
      case LANGUAGE.VIETNAMESE:
        timeFormat[0] = 'HH:mm';
        break;
      case LANGUAGE.THAI:
        timeFormat[2] = 'HH:mm';
        break;
      case LANGUAGE.ENGLISH:
        timeFormat[2] = 'h:mm A';
        break;
    }

  if (day)
    switch (lng) {
      case LANGUAGE.KOREAN:
        timeFormat[1] = 'M월 D일';
        break;
      case LANGUAGE.JAPANESE:
      case LANGUAGE.CHINESE:
        timeFormat[1] = 'M月 D日';
        break;
      case LANGUAGE.VIETNAMESE:
        timeFormat[1] = '[ngày] D MMMM';
        break;
      case LANGUAGE.THAI:
        timeFormat[0] = 'D MMMM';
        break;
      case LANGUAGE.ENGLISH:
        timeFormat[0] = 'M/D';
        break;
    }

  if (year)
    switch (lng) {
      case LANGUAGE.KOREAN:
        timeFormat[0] = 'YYYY년';
        break;
      case LANGUAGE.JAPANESE:
      case LANGUAGE.CHINESE:
        timeFormat[0] = 'YYYY年';
        break;
      case LANGUAGE.VIETNAMESE:
        timeFormat[2] = '[năm] YYYY';
        break;
      case LANGUAGE.THAI:
        extend(buddhistEra);
        timeFormat[1] = 'BBBB [BE]';
        break;
      case LANGUAGE.ENGLISH:
        timeFormat[1] = 'YYYY';
        break;
    }

  let format: string;

  if (lng === LANGUAGE.ENGLISH) {
    const datePart = [timeFormat[0], timeFormat[1]].filter(Boolean).join('/');
    format = [datePart, timeFormat[2]].join(' ');
  } else {
    format = timeFormat.join(' ');
  }

  return localeDate.format(format.trim());
};
