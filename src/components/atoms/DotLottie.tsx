'use client';

import {
  type DotLottie as DotLottieType,
  DotLottieReact,
  type DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';
import { memo, useCallback } from 'react';

export interface DotLottieProps
  extends Omit<DotLottieReactProps, 'role' | 'aria-hidden'> {
  onCompleted?: () => void;
}

const MomorizedDotLottie = memo(DotLottieReact);

export const DotLottie = ({
  onCompleted,
  dotLottieRefCallback,
  autoplay = true,
  loop = true,
  ...props
}: DotLottieProps) => {
  const callbackRef = useCallback(
    (dotLottie: DotLottieType) => {
      dotLottieRefCallback?.(dotLottie);

      if (onCompleted) {
        dotLottie.addEventListener('complete', onCompleted);

        return () => {
          dotLottie.removeEventListener('complete', onCompleted);
        };
      }
    },
    [dotLottieRefCallback, onCompleted],
  );

  return (
    <MomorizedDotLottie
      {...props}
      aria-hidden="true"
      autoplay={autoplay}
      dotLottieRefCallback={callbackRef}
      loop={loop}
      role="presentation"
    />
  );
};

export type { DotLottieType };
