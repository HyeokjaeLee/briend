import { cn } from '@/utils';

import { CommonSkeleton } from '../atoms/CommonSkeleton';

export interface PageLoadingTemplateProps {
  className?: string;
}

export const PageLoadingTemplate = ({
  className,
}: PageLoadingTemplateProps) => {
  return (
    <div className={cn('flex-center size-full flex-1 cursor-wait', className)}>
      <CommonSkeleton />
    </div>
  );
};
