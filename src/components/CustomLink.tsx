'use client';

import Link, { type LinkProps } from 'next/link';
import { useShallow } from 'zustand/shallow';

import { useEffect, useState } from 'react';

import { NAVIGATION_ANIMATION } from '@/constants/etc';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { useCustomHref } from '@/hooks/useCustomHref';
import { useGlobalStore } from '@/stores/global';
import { isCurrentHref } from '@/utils/isCurrentHref';

interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  i18nOptimize?: boolean;
  withLoading?: boolean;
  withAnimation?: NAVIGATION_ANIMATION;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  replace,
  withLoading = true,
  withAnimation = NAVIGATION_ANIMATION.FROM_BOTTOM,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  const stringHref = href.toString();

  const [customHref, setCustomHref] = useState(stringHref);

  const [setIsLoading, setNavigationAnimation] = useGlobalStore(
    useShallow((state) => [state.setIsLoading, state.setNavigationAnimation]),
  );

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

        if (withLoading) setIsLoading(true);

        if (withAnimation) setNavigationAnimation(withAnimation);

        if (replace)
          sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};
