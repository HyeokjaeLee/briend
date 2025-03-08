'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants';
import { useThisSidePanel } from '@/hooks';
import { cn } from '@/utils';

export const CustomTopHeader = ({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [headerContainerElement, setHeaderContainerElement] =
    useState<HTMLElement | null>(null);

  const { isSidePanel } = useThisSidePanel();

  useLayoutEffect(() => {
    const topHeader = document.getElementById(
      isSidePanel ? SELECTOR.SIDE_TOP_HEADER : SELECTOR.TOP_HEADER,
    );

    setHeaderContainerElement(topHeader);
  }, [isSidePanel]);

  const contents = (
    <div
      {...restProps}
      className={cn(
        'px-5 py-3',
        {
          'invisible fixed left-0 top-0': !headerContainerElement,
          'animate-fade-down animate-duration-100': headerContainerElement,
        },
        className,
      )}
    />
  );

  return headerContainerElement
    ? createPortal(contents, headerContainerElement)
    : contents;
};
