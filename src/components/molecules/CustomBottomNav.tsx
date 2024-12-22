'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants';
import { cn } from '@/utils';

export type CustomBottomNavProps = React.HTMLAttributes<HTMLDivElement>;

export const CustomBottomNav = ({
  className,
  ...props
}: CustomBottomNavProps) => {
  const [bottomContainerElement, setBottomContainerElement] =
    useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const bottomNav = document.getElementById(SELECTOR.BOTTOM_NAV);
    setBottomContainerElement(bottomNav);
  }, []);

  const contents = (
    <div
      {...props}
      className={cn(
        'border-t border-t-slate-200 bg-slate-100 animate-fade-up animate-duration-100',
        {
          'sticky bottom-0 w-full left-0': !bottomContainerElement,
        },
        className,
      )}
    />
  );

  return bottomContainerElement
    ? createPortal(contents, bottomContainerElement)
    : null;
};
