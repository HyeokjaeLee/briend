'use client';

import { RiArrowGoBackFill } from 'react-icons/ri';

import { Button, CustomTopHeader } from '@/components';
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
      <nav className={cn('flex h-14 items-center gap-5 px-1', className)}>
        <Button variant="ghost" onClick={() => router.back()}>
          <RiArrowGoBackFill className="size-6 text-slate-900" />
        </Button>
        {children}
      </nav>
    </CustomTopHeader>
  );
};
