import { cn } from '@/utils';

import { Spinner } from '../atoms/Spinner';

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
      <Spinner className={cn('size-40', spinnerClassName)} />
    </div>
  );
};
