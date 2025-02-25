import { cn } from '@/utils';

import { DotLottie } from '../atoms/DotLottie';

export interface LoadingTemplateProps {
  className?: string;
  spinnerClassName?: string;
}

export const LoadingTemplate = ({
  className,
  spinnerClassName,
}: LoadingTemplateProps) => {
  return (
    <div
      className={cn(
        'bg-white-100 flex-center size-full flex-1 cursor-wait flex-col gap-4',
        className,
      )}
    >
      <DotLottie
        className={cn('animate-fade -z-10 h-40', spinnerClassName)}
        src="/assets/lottie/spinner.lottie"
      />
    </div>
  );
};
