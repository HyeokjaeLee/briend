'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, Lock } from 'react-feather';

import { msToTime } from '@/utils';
import { Skeleton } from '@hyeokjaelee/pastime-ui';

interface LeftTimerProps {
  endAt: Date;
  size?: 'large' | 'small';
}

export const LeftTimer = ({ endAt, size = 'large' }: LeftTimerProps) => {
  const calculateTimeLeft = useCallback(
    () => endAt.getTime() - new Date().getTime(),
    [endAt],
  );

  const [time, setTime] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      const leftTime = calculateTimeLeft();

      if (leftTime < 0) {
        clearInterval(interval);
        return setTime(-1);
      }

      setTime(leftTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const sizeClassName = {
    large: {
      height: 'h-10',
      skeletonWidth: 'w-36',
      icon: 'w-7 h-7',
      text: 'text-xl font-normal font-mono',
    },
    small: {
      height: 'h-3',
      skeletonWidth: 'w-20',
      icon: 'w-3 h-3',
      text: 'text-xs font-normal font-mono',
    },
  }[size];

  if (!time) {
    return (
      <Skeleton
        className={`${sizeClassName.height} ${sizeClassName.skeletonWidth}`}
      />
    );
  }

  const { hours, minutes, seconds } = msToTime(time);

  return (
    <div
      className={`flex justify-center items-center ${sizeClassName.height} gap-2 w-fit`}
    >
      {time === -1 ? (
        <>
          <Lock className={sizeClassName.icon} />
          <span className={sizeClassName.text}>00:00:00</span>
        </>
      ) : (
        <>
          <Clock className={sizeClassName.icon} />
          <span className={sizeClassName.text}>
            {hours}:{minutes}:{seconds}
          </span>
        </>
      )}
    </div>
  );
};
