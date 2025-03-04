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
  ariaLabel?: string;
}

const MemorizedDotLottie = memo(DotLottieReact);

export const DotLottie = ({
  onCompleted,
  dotLottieRefCallback,
  autoplay = true,
  loop = true,
  ariaLabel,
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
    <MemorizedDotLottie
      {...props}
      autoplay={autoplay}
      dotLottieRefCallback={callbackRef}
      loop={loop}
      role="presentation"
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
};

export type { DotLottieType };
