import { cn } from '@/utils';

import { DotLottie } from '../atoms/DotLottie';

export interface LoadingTemplateProps {
  className?: string;
}

export const LoadingTemplate = ({ className }: LoadingTemplateProps) => {
  return (
    <div
      className={cn(
        'z-50 size-full flex-1 flex-col gap-4 bg-white-100 flex-center cursor-wait',
        className,
      )}
    >
      <DotLottie
        aria-hidden="true"
        className="h-40"
        role="presentation"
        src="/assets/lottie/spinner.lottie"
      />
    </div>
  );
};
