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
  /** 실제 라우팅 이동을 하지않고 인터셉트 라우트만 노출 */
  onlyIntercept?: boolean;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  replace,
  withLoading = true,
  withAnimation,
  onlyIntercept = false,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  let animationType = withAnimation;
  let isReplace = replace;
  let isLoading = withLoading;

  if (onlyIntercept) {
    animationType ??= 'NONE';
    isReplace ??= true;
    isLoading = false;
  }

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

        if (isLoading) setGlobalLoading(true);

        if (onlyIntercept) {
          sessionStorage.setItem(SESSION_STORAGE.ONLY_INTERCEPT, location.href);
        }

        if (animationType) {
          sessionStorage.setItem(
            SESSION_STORAGE.NAVIGATION_ANIMATION,
            animationType,
          );
        }

        if (isReplace)
          sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');

        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};
