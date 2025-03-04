import { cn } from '@/utils';

import { DotLottie } from './DotLottie';

export interface CommonSkeletonProps {
  className?: string;
}

export const CommonSkeleton = ({ className }: CommonSkeletonProps) => {
  return (
    <DotLottie
      src="/assets/lottie/common-skeleton.lottie"
      aria-label="loading"
      className={cn('animate-fade size-full cursor-wait', className)}
    />
  );
};
