'use client';

import type { LottieComponentProps as OriginalLottieProps } from 'lottie-react';

import dynamic from 'next/dynamic';

import { memo } from 'react';

const OriginalLottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

type LottieProps = OriginalLottieProps;

export const Lottie = memo(({ loop = false, ...props }: LottieProps) => {
  return <OriginalLottie {...props} loop={loop} />;
});

Lottie.displayName = 'Lottie';
