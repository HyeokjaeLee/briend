'use client';

import Link, { type LinkProps } from 'next/link';
import { useShallow } from 'zustand/shallow';

import { SESSION_STORAGE } from '@/constants';
import { useCustomHref } from '@/hooks';
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
  withAnimation = 'NONE',
  toSidePanel,
  ...restLinkProps
}: CustomLinkProps) => {
  const getCustomHref = useCustomHref();

  const stringHref = href.toString();

  const [setGlobalLoading, setSidePanelUrl] = useGlobalStore(
    useShallow((state) => [state.setGlobalLoading, state.setSidePanelUrl]),
  );

  const customHref = i18nOptimize ? getCustomHref(stringHref) : stringHref;

  return (
    <Link
      {...restLinkProps}
      shallow
      href={customHref}
      replace={replace}
      onClick={(e) => {
        if (toSidePanel) {
          e.preventDefault();

          setSidePanelUrl(customHref);

          return;
        }

        try {
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
