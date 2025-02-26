'use client';

import { usePathname } from 'next/navigation';

import { useTranslation } from '@/configs/i18n/client';
import { Logo } from '@/components';
import { findRoute } from '@/utils';

export const RootHeader = () => {
  const pathname = usePathname();

  const currentRoute = findRoute(pathname);

  const { t } = useTranslation('layout');

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
