'use client';

import { useEffect, useState } from 'react';
import { RiAlarmLine } from 'react-icons/ri';

import { cn } from '@/utils';

export interface TimerProps {
  expires: Date;
  onChangeLeftSeconds?: (leftSeconds: number) => void;
  onTimeout?: () => void;
  className?: string;
  stop?: boolean;
}

export const Timer = ({
  expires,
  onChangeLeftSeconds,
  onTimeout,
  className,
  stop,
}: TimerProps) => {
  const [leftSeconds, setLeftSeconds] = useState<number>(-1);

  const timeoutSec = new Date(expires).getTime();

  const [error, setError] = useState<Error>();

  if (error) throw error;

  useEffect(() => {
    if (leftSeconds === 0 || stop) return;

    const handleNextLeftSeconds = () => {
      const timerAction = (leftSec: number) => {
        onChangeLeftSeconds?.(leftSec);
        setLeftSeconds(leftSec);

        return leftSec;
      };

      const nextLeftSeconds = Math.floor(
        (timeoutSec - new Date().getTime()) / 1_000,
      );

      if (nextLeftSeconds <= 0) {
        //! setTimeout에서 발생한 error를 전역 error boundary에서 처리
        try {
          onTimeout?.();
        } catch (e) {
          if (e instanceof Error) setError(e);
        }

        return timerAction(0);
      }

      return timerAction(nextLeftSeconds);
    };

    if (leftSeconds === -1) {
      handleNextLeftSeconds();
    }

    const timer = setTimeout(() => {
      if (!handleNextLeftSeconds()) clearTimeout(timer);
    }, 1_000);

    return () => clearTimeout(timer);
  }, [leftSeconds, onChangeLeftSeconds, onTimeout, timeoutSec, stop]);

  const notEnoughTime = leftSeconds < 60;

  const hours = Math.floor(leftSeconds / 3_600);
  const minutes = Math.floor((leftSeconds % 3_600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (leftSeconds % 60).toString().padStart(2, '0');

  return (
    <strong
      className={cn(
        'flex items-center gap-2 text-slate-900 min-w-24',
        {
          'text-red-500': notEnoughTime,
          invisible: leftSeconds <= 0,
          'animate-fade animate-reverse animate-duration-1000':
            leftSeconds <= 1,
        },
        className,
      )}
    >
      <RiAlarmLine
        className={cn('size-6', {
          'animate-wiggle-more animate-duration-500 animate-infinite':
            notEnoughTime,
        })}
      />
      <span
        className={cn('text-lg font-semibold', {
          'animate-pulse animate-duration-1000 animate-infinite': notEnoughTime,
        })}
      >
        {hours ? `${hours.toString().padStart(2, '0')}:` : ''}
        {minutes}:{seconds}
      </span>
    </strong>
  );
};
