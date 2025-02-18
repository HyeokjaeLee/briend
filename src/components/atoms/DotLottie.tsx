'use client';

import {
  type DotLottie as DotLottieType,
  DotLottieReact,
  type DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';
import { memo, useEffect, useState } from 'react';

export interface DotLottieProps
  extends Omit<DotLottieReactProps, 'role' | 'aria-hidden'> {
  onCompleted?: () => void;
}

export const DotLottie = memo(
  ({
    onCompleted,
    dotLottieRefCallback,
    autoplay = true,
    loop = true,
    ...props
  }: DotLottieProps) => {
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
        {...props}
        aria-hidden="true"
        autoplay={autoplay}
        dotLottieRefCallback={(dotLottie) => {
          setDotLottie(dotLottie);
          dotLottieRefCallback?.(dotLottie);
        }}
        loop={loop}
        role="presentation"
      />
    );
  },
);

DotLottie.displayName = 'DotLottie';

export type { DotLottieType };
