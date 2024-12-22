'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants/selector';
import { cn } from '@/utils/cn';

export const CustomBottomNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
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
