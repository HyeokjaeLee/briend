'use client';

import { usePathname } from 'next/navigation';

import { CustomLink, Logo } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { ROUTES } from '@/routes/client';
import { findRoute } from '@/utils';

export const RootHeader = () => {
  const pathname = usePathname();

  const currentRoute = findRoute(pathname);

  const { t } = useTranslation('layout');

  const { topHeaderTitle } = currentRoute;

  return (
    <nav className="flex h-14 items-center justify-between px-5">
      <CustomLink
        href={ROUTES.FRIEND_LIST.pathname}
        replace
        withAnimation="FROM_LEFT"
      >
        <Logo className="h-7 text-slate-900" />
      </CustomLink>
      <div className="flex items-center gap-3">
        {topHeaderTitle ? (
          <h2 className="text-lg font-semibold">{t(topHeaderTitle)}</h2>
        ) : null}
      </div>
    </nav>
  );
};
