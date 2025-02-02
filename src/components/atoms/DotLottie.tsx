'use client';

import { memo, useEffect, useState } from 'react';

import {
  DotLottieReact,
  type DotLottie as DotLottieType,
  type DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';

export interface DotLottieProps
  extends Omit<DotLottieReactProps, 'role' | 'aria-hidden'> {
  onCompleted?: () => void;
}

export const DotLottie = memo(({ onCompleted, ...props }: DotLottieProps) => {
  const [dotLottie, setDotLottie] = useState<DotLottieType | null>(null);

  useEffect(() => {
    if (!dotLottie) return;

    if (onCompleted) dotLottie.addEventListener('complete', onCompleted);

    return () => {
      dotLottie.removeEventListener('complete', onCompleted);
    };
  }, [dotLottie, onCompleted]);

  return (
    <DotLottieReact
      autoplay
      loop
      aria-hidden="true"
      dotLottieRefCallback={setDotLottie}
      role="presentation"
      {...props}
    />
  );
});

DotLottie.displayName = 'DotLottie';
