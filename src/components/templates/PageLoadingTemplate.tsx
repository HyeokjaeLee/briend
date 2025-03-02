import { cn } from '@/utils';

import { DotLottie } from '../atoms/DotLottie';

export interface PageLoadingTemplateProps {
  className?: string;
}

export const PageLoadingTemplate = ({
  className,
}: PageLoadingTemplateProps) => {
  return (
    <div className={cn('flex-center size-full flex-1 cursor-wait', className)}>
      <DotLottie
        src="/assets/lottie/common-skeleton.lottie"
        className="animate-fade size-full"
      />
    </div>
  );
};
