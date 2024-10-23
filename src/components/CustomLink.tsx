'use client';

import Link, { type LinkProps } from 'next/link';

import { useEffect, useState } from 'react';

import { SESSION_STORAGE } from '@/constants/storage-key';
import { useCustomHref } from '@/hooks/useCustomHref';
import { useGlobalStore } from '@/stores/global';
import { isCurrentHref } from '@/utils/isCurrentHref';

interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  i18nOptimize?: boolean;
  routingLoading?: boolean;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  replace,
  routingLoading = true,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  const stringHref = href.toString();

  const [customHref, setCustomHref] = useState(stringHref);

  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

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

        if (replace) {
          sessionStorage.setItem(SESSION_STORAGE.REPLACED_MARK, 'true');
        }

        if (routingLoading) {
          setIsLoading(true);
        }

        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};
