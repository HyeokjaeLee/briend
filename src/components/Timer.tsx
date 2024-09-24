'use client';

import { useEffect, useState } from 'react';
import { BiAlarm } from 'react-icons/bi';

import { cn } from '@/utils';

interface TimerProps {
  expires: Date;
  onChangeLeftSeconds?: (leftSeconds: number) => void;
}

export const Timer = ({ expires, onChangeLeftSeconds }: TimerProps) => {
  const [leftSeconds, setLeftSeconds] = useState<number>(-1);

  const timeoutSec = new Date(expires).getTime();

  useEffect(() => {
    if (leftSeconds === 0) return;

    const handleNextLeftSeconds = () => {
      const nextLeftSeconds = Math.floor(
        (timeoutSec - new Date().getTime()) / 1_000,
      );

      const timerAction = (leftSec: number) => {
        onChangeLeftSeconds?.(leftSec);
        setLeftSeconds(leftSec);

        return leftSec;
      };

      if (nextLeftSeconds <= 0) return timerAction(0);

      return timerAction(nextLeftSeconds);
    };

    if (leftSeconds === -1) {
      handleNextLeftSeconds();
    }

    const timer = setTimeout(() => {
      if (!handleNextLeftSeconds()) clearTimeout(timer);
    }, 1_000);

    return () => clearTimeout(timer);
  }, [leftSeconds, onChangeLeftSeconds, timeoutSec]);

  const notEnoughTime = leftSeconds < 60;

  return (
    <strong
      className={cn('flex items-center gap-2 text-slate-900', {
        'text-red-600': notEnoughTime,
        invisible: leftSeconds <= 0,
        'animate-fade animate-reverse animate-duration-1000': leftSeconds <= 1,
      })}
    >
      <BiAlarm
        className={cn('size-6', {
          'animate-wiggle-more animate-infinite': notEnoughTime,
        })}
      />
      <span
        className={cn('text-lg font-semibold', {
          'animate-pulse animate-infinite': notEnoughTime,
        })}
      >
        {Math.floor(leftSeconds / 60)
          .toString()
          .padStart(2, '0')}
        :{(leftSeconds % 60).toString().padStart(2, '0')}
      </span>
    </strong>
  );
};
