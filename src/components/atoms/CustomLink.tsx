'use client';

import Link, { type LinkProps } from 'next/link';

import { useEffect, useState } from 'react';

import type { SESSION_STORAGE_TYPE } from '@/constants/storage-key';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { useCustomHref } from '@/hooks/useCustomHref';
import { useGlobalStore } from '@/stores/global';
import { isCurrentHref } from '@/utils/isCurrentHref';

interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  i18nOptimize?: boolean;
  withLoading?: boolean;
  withAnimation?: SESSION_STORAGE_TYPE.NAVIGATION_ANIMATION;
  intercept?: boolean;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  replace,
  withLoading = true,
  withAnimation,
  intercept = false,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  const stringHref = href.toString();

  const [customHref, setCustomHref] = useState(stringHref);

  const setGlobalLoading = useGlobalStore((state) => state.setGlobalLoading);

  useEffect(() => {
    if (!i18nOptimize) return;

    const customHref = getCustomHref(stringHref);

    setCustomHref(customHref);
  }, [getCustomHref, i18nOptimize, stringHref]);

  return (
    <Link
      {...restLinkProps}
      href={customHref}
      replace={replace}
      onClick={(e) => {
        if (isCurrentHref(customHref)) {
          console.info('blocked by same href');

          return e.preventDefault();
        }

        if (withLoading) setGlobalLoading(true);

        if (withAnimation) {
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            withAnimation,
          );
        }

        if (replace)
          sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};
