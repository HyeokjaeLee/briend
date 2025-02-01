'use client';

import { memo } from 'react';

import {
  DotLottieReact,
  type DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';

export type DotLottieProps = DotLottieReactProps;

export const DotLottie = memo(
  ({ loop = true, autoplay = true, ...restProps }: DotLottieProps) => {
    return <DotLottieReact autoplay={autoplay} loop={loop} {...restProps} />;
  },
);

DotLottie.displayName = 'DotLottie';
