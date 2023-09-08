'use client';

import { useCallback, useEffect, useState } from 'react';

import { msToTime } from '@/utils';

interface LeftTimerProps {
  endAt: Date;
  className?: string;
}

export const LeftTimer = ({ endAt, className }: LeftTimerProps) => {
  const calculateTimeLeft = useCallback(
    () => endAt.getTime() - new Date().getTime(),
    [endAt],
  );

  const [time, setTime] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const { hours, minutes, seconds } = msToTime(time);

  return (
    <span className={className}>
      {hours}:{minutes}:{seconds}
    </span>
  );
};
