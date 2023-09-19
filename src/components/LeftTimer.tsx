'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock } from 'react-feather';

import { msToTime } from '@/utils';
import { Skeleton } from '@hyeokjaelee/pastime-ui';

interface LeftTimerProps {
  endAt: Date;
}

export const LeftTimer = ({ endAt }: LeftTimerProps) => {
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

  if (!time) return <Skeleton className="h-10 w-24" />;

  const { hours, minutes, seconds } = msToTime(time);

  return (
    <div className={`flex justify-between items-center h-10 gap-2 w-fit`}>
      <Clock />
      <span className="text-xl">
        {hours}:{minutes}:{seconds}
      </span>
    </div>
  );
};
