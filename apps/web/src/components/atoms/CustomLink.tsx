'use client';

import Link, { type LinkProps } from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';

import { SESSION_STORAGE } from '@/constants';
import { useCustomHref, useSidePanel } from '@/hooks';
import { type NAVIGATION_ANIMATION, useGlobalStore } from '@/stores';
import { isCurrentHref } from '@/utils';
import { setExitNavigationAnimation } from '@/utils/client';

export interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  i18nOptimize?: boolean;
  withLoading?: boolean;
  withAnimation?: NAVIGATION_ANIMATION;
  toSidePanel?: boolean;
  disabled?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  replace,
  withLoading = false,
  withAnimation: forceAnimation,
  toSidePanel,
  disabled,
  target,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  const stringHref = href.toString();

  const setGlobalLoading = useGlobalStore((state) => state.setGlobalLoading);

  const sidePanel = useSidePanel();

  const customHref = i18nOptimize ? getCustomHref(stringHref) : stringHref;

  const withAnimation = forceAnimation ?? (replace ? 'NONE' : 'FROM_BOTTOM');

  return (
    <Link
      {...restLinkProps}
      target={target}
      shallow
      href={customHref}
      replace={replace}
      onClick={(e) => {
        if (disabled) return e.preventDefault();

        try {
          if (toSidePanel) {
            e.preventDefault();

            return sidePanel.push(customHref, {
              withAnimation,
            });
          }

          if (isCurrentHref(customHref)) {
            console.info('blocked by same href');

            return e.preventDefault();
          }

          if (withLoading) setGlobalLoading(true);

          setExitNavigationAnimation(withAnimation);

          if (replace)
            sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');
        } finally {
          onClick?.(e);
        }
      }}
    >
      {children}
    </Link>
  );
};
