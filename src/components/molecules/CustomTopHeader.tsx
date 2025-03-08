'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants';
import { cn } from '@/utils';

export interface CustomTopHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sidePanel?: boolean;
}

export const CustomTopHeader = ({
  className,
  sidePanel,
  ...restProps
}: CustomTopHeaderProps) => {
  const [headerContainerElement, setHeaderContainerElement] =
    useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const topHeader = document.getElementById(
      sidePanel ? SELECTOR.SIDE_TOP_HEADER : SELECTOR.TOP_HEADER,
    );

    setHeaderContainerElement(topHeader);
  }, [sidePanel]);

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
