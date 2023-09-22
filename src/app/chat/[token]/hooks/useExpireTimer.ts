import { useEffect, useState } from 'react';

import { LANGUAGE_PACK } from '@/constants';
import type { LANGUAGE } from '@/constants';
import { msToTime } from '@/utils';

export const useExpireTimer = (endAt?: Date, userLanguage?: LANGUAGE) => {
  const [time, setTime] = useState<number>();

  useEffect(() => {
    if (endAt) {
      const interval = setInterval(() => {
        const leftTime = endAt.getTime() - new Date().getTime();

        if (leftTime < 0) {
          clearInterval(interval);
          return setTime(-1);
        }

        setTime(leftTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endAt]);

  if (!time || !userLanguage) {
    return {
      isExpired: false,
      placeholder: undefined,
    };
  }

  if (time > 0) {
    return {
      isExpired: false,
      placeholder: LANGUAGE_PACK.CHATTING_EXPIRED_TIMER_PLACEHOLDER[
        userLanguage
      ](msToTime(time)),
    };
  }

  return {
    isExpired: true,
    placeholder: LANGUAGE_PACK.EXPIRED_CHATTING_ROOM_PLACEHOLDER[userLanguage],
  };
};
