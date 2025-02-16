'use client';

import type { DotLottieType } from './DotLottie';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils';

import { DotLottie } from './DotLottie';

export interface CheckboxProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    'className' | 'checked' | 'disabled'
  > {
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  checked,
  className,
  onChange,
  disabled,
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked ?? false);
  const [dotLottie, setDotLottie] = useState<DotLottieType | null>(null);

  const finallyChecked = checked ?? isChecked;
  const [mode, setMode] = useState<'reverse' | 'forward'>(
    checked ? 'reverse' : 'forward',
  );

  const prevFinallyChecked = useRef(finallyChecked);

  useEffect(() => {
    if (!dotLottie) return;

    if (finallyChecked !== prevFinallyChecked.current) {
      if (finallyChecked) {
        setMode('forward');
        dotLottie.play();
      } else {
        dotLottie.pause();
        dotLottie.setFrame(0);
      }
      prevFinallyChecked.current = finallyChecked;
    }
  }, [finallyChecked, dotLottie]);

  return (
    <div
      className={cn(
        'relative size-5 flex-center flex-shrink-0 rounded-full',
        {
          'border border-slate-300': !finallyChecked,
        },
        className,
      )}
    >
      <DotLottie
        autoplay={false}
        className={cn(
          'size-full',
          'absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2',
          {
            grayscale: disabled,
          },
        )}
        dotLottieRefCallback={setDotLottie}
        loop={false}
        mode={mode}
        speed={2}
        src="/assets/lottie/checkbox.lottie"
      />
      <input
        checked={finallyChecked}
        className={cn('left-0 top-0 size-full cursor-pointer invisible', {
          'cursor-not-allowed': disabled,
        })}
        disabled={disabled}
        type="checkbox"
        onChange={({ target: { checked } }) => {
          onChange?.(checked);
          setIsChecked(checked);
          dotLottie?.play();
        }}
      />
    </div>
  );
};
