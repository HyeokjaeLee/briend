'use client';

import dynamic from 'next/dynamic';

import type { LottieProps as OriginalLottieProps } from 'react-lottie';

import { cn } from '@/utils/cn';

const OriginalLottie = dynamic(() => import('react-lottie'), {
  ssr: false,
});

interface LottieProps
  extends Omit<OriginalLottieProps, 'options' | 'isClickToPauseDisabled'> {
  data: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  sizing?: 'contain' | 'cover' | 'none';
}

export const Lottie = ({
  data,
  loop = true,
  autoplay = true,
  className,
  sizing = 'contain',
  ...restProps
}: LottieProps) => {
  return (
    <OriginalLottie
      {...restProps}
      isClickToPauseDisabled
      options={{
        autoplay,
        animationData: data,
        loop,
        rendererSettings: {
          className: cn('size-full cursor-default', className),
          preserveAspectRatio: {
            contain: 'xMidYMid meet',
            cover: 'xMidYMid slice',
            none: 'none',
          }[sizing],
        },
      }}
    />
  );
};
