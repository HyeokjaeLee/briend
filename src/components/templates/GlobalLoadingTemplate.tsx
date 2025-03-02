import { cn } from '@/utils';

import { DotLottie } from '../atoms/DotLottie';

export interface GlobalLoadingTemplateProps {
  className?: string;
  spinnerClassName?: string;
}

export const GlobalLoadingTemplate = ({
  className,
  spinnerClassName,
}: GlobalLoadingTemplateProps) => {
  return (
    <div className={cn('flex-center size-full flex-1 cursor-wait', className)}>
      <DotLottie
        className={cn('animate-fade -z-10 h-40', spinnerClassName)}
        src="/assets/lottie/spinner.lottie"
      />
    </div>
  );
};
