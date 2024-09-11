'use client';

import Link, { type LinkProps } from 'next/link';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { COOKIES } from '@/constants/cookies-key';

interface CustomLinkProps extends LinkProps {
  children?: React.ReactNode;
  i18nOptimize?: boolean;
}

export const CustomLink = ({
  children,
  href,
  onClick,
  i18nOptimize = true,
  ...restLinkProps
}: CustomLinkProps) => {
  const [{ i18next }] = useCookies([COOKIES.I18N]);
  const stringHref = href.toString();
  const [customHref, setCustomHref] = useState(stringHref);

  useEffect(() => {
    if (!i18next || !i18nOptimize) return;

    const lngPath = `/${i18next}`;

    if (stringHref.startsWith(lngPath)) return;

    let newHref = lngPath + stringHref;

    if (newHref.endsWith('/')) {
      newHref = newHref.slice(0, -1);
    }

    setCustomHref(newHref);
  }, [i18nOptimize, i18next, stringHref]);

  return (
    <Link
      {...restLinkProps}
      href={customHref}
      onClick={(e) => {
        if (new URL(customHref, location.origin).toString() === location.href) {
          console.info('blocked');

          return e.preventDefault();
        }

        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};
