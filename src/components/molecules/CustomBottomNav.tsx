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

  return bottomContainerElement
    ? createPortal(
        <div
          {...props}
          className={cn(
            'border-t border-t-slate-200 bg-slate-100 animate-fade-up animate-duration-100',
            className,
          )}
        />,
        bottomContainerElement,
      )
    : null;
};
