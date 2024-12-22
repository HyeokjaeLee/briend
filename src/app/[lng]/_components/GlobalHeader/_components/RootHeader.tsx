'use client';

import { usePathname } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import Logo from '@/svgs/logo.svg';
import { findRoute } from '@/utils';

export const RootHeader = () => {
  const { t } = useTranslation('layout');

  const pathname = usePathname();

  const currentRoute = findRoute(pathname);

  const { topHeaderTitle } = currentRoute;

  return (
    <nav className="flex h-14 items-center justify-between px-5">
      <Logo className="h-7 text-slate-900" />
      <div className="flex items-center gap-3">
        {topHeaderTitle ? (
          <h2 className="text-lg font-semibold">{t(topHeaderTitle)}</h2>
        ) : null}
      </div>
    </nav>
  );
};
