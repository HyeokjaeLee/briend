'use client';

import { RiArrowGoBackFill } from 'react-icons/ri';

import { CustomIconButton, CustomTopHeader } from '@/components';
import { useCustomRouter } from '@/hooks';
import { cn } from '@/utils';

export interface BackHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const BackHeader = ({ className, children }: BackHeaderProps) => {
  const router = useCustomRouter();

  return (
    <CustomTopHeader className="p-0">
      <nav className={cn('flex h-14 items-center gap-5 px-5', className)}>
        <CustomIconButton
          size="3"
          variant="ghost"
          onClick={() => router.back()}
        >
          <RiArrowGoBackFill className="size-6 text-slate-900" />
        </CustomIconButton>
        {children}
      </nav>
    </CustomTopHeader>
  );
};
