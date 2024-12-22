'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { SELECTOR } from '@/constants';
import { cn } from '@/utils';

export type CustomTopHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CustomTopHeader = ({
  className,
  ...props
}: CustomTopHeaderProps) => {
  const [headerContainerElement, setHeaderContainerElement] =
    useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const topHeader = document.getElementById(SELECTOR.TOP_HEADER);
    setHeaderContainerElement(topHeader);
  }, []);

  const contents = (
    <div
      {...props}
      className={cn(
        'px-5 py-3',
        {
          'invisible fixed top-0 left-0': !headerContainerElement,
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
