'use client';

import { RiArrowGoBackFill, RiCloseLine } from 'react-icons/ri';

import { Button, CustomTopHeader } from '@/components';
import { useCustomRouter, useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { cn } from '@/utils';

export interface BackHeaderProps {
  className?: string;
  children?: React.ReactNode;
  sidePanel?: boolean;
}

export const BackHeader = ({
  className,
  children,
  sidePanel,
}: BackHeaderProps) => {
  const router = useCustomRouter();
  const { push } = useSidePanel();

  return (
    <CustomTopHeader className="p-0" sidePanel={sidePanel}>
      <nav
        className={cn(
          'flex h-14 items-center gap-5',
          sidePanel ? 'pl-5 pr-1' : 'pl-1 pr-5',
          className,
        )}
      >
        {sidePanel ? null : (
          <Button variant="ghost" onClick={() => router.back()}>
            <RiArrowGoBackFill className="size-6 text-slate-900" />
          </Button>
        )}
        {children}
        {sidePanel ? (
          <Button
            variant="ghost"
            onlyIcon
            onClick={() => {
              push(ROUTES.FRIEND_LIST.pathname, {
                withAnimation: 'FROM_TOP',
              });
            }}
          >
            <RiCloseLine />
          </Button>
        ) : null}
      </nav>
    </CustomTopHeader>
  );
};
