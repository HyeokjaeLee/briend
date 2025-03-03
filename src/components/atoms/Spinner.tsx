import { cn } from '@/utils';

import { DotLottie } from './DotLottie';

export interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <DotLottie
      src="/assets/lottie/loading.lottie"
      className={cn('animate-fade size-full', className)}
    />
  );
};
