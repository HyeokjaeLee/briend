import { cn } from '@/utils/cn';
import LoadingLottie from '@assets/lottie/loading.json';

import { Lottie } from '../atoms/Lottie';
interface LoadingTemplateProps {
  className?: string;
}

export const LoadingTemplate = ({ className }: LoadingTemplateProps) => {
  return (
    <div
      className={cn(
        'z-50 size-full flex-1 flex-col gap-4 bg-slate-100 flex-center',
        className,
      )}
    >
      <div className="size-80">
        <Lottie
          loop
          className="cursor-wait"
          data={LoadingLottie}
          sizing="contain"
        />
      </div>
    </div>
  );
};
