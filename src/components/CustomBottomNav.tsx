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
        'border-t-slate-750 bg-slate-830 px-6 py-3 border-t-2',
        {
          'invisible fixed bottom-0 left-0': !bottomContainerElement,
          'animate-fade-up animate-duration-100': bottomContainerElement,
        },
        className,
      )}
    />
  );

  return bottomContainerElement
    ? createPortal(contents, bottomContainerElement)
    : contents;
};
