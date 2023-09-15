'use client';

import { useCallback, useEffect, useState } from 'react';

import { msToTime } from '@/utils';
import { Skeleton } from '@hyeokjaelee/pastime-ui';

interface LeftTimerProps {
  endAt: Date;
  className?: string;
}

export const LeftTimer = ({ endAt, className }: LeftTimerProps) => {
  const calculateTimeLeft = useCallback(
    () => endAt.getTime() - new Date().getTime(),
    [endAt],
  );

  const [time, setTime] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  if (!time) return <Skeleton className={`${className} h-[1.55em] w-[4em]`} />;

  const { hours, minutes, seconds } = msToTime(time);

  return (
    <span className={className}>
      {hours}:{minutes}:{seconds}
    </span>
  );
};
