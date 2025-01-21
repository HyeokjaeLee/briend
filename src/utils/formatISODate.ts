import type { Dayjs } from 'dayjs';

export const formatISODate = (date: Dayjs) => {
  return date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};
