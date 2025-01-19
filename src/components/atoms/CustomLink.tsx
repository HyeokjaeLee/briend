'use client';

import Link, { type LinkProps } from 'next/link';

import { SESSION_STORAGE } from '@/constants';
import { useCustomHref, useSidePanel } from '@/hooks';
import { useGlobalStore, type NAVIGATION_ANIMATION } from '@/stores';
import { isCurrentHref } from '@/utils';
import { setExitNavigationAnimation } from '@/utils/client';

export interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  i18nOptimize?: boolean;
  withLoading?: boolean;
  withAnimation?: NAVIGATION_ANIMATION;
  toSidePanel?: boolean;
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
      shallow
      href={customHref}
      replace={replace}
      onClick={(e) => {
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
