'use client';

import { usePathname } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import { ROUTES } from '@/routes/client';
import Logo from '@/svgs/logo.svg';
import { findRoute } from '@/utils/findRoute';

export const RootHeader = () => {
  const { t } = useTranslation('layout');

  const pathname = usePathname();

  const currentRoute = findRoute(pathname);

  let emoji = '';

  switch (currentRoute) {
    case ROUTES.HOME:
      emoji = '💬';
      break;
    case ROUTES.INVITE_CHAT:
      emoji = '📨';
      break;
    case ROUTES.MORE_MENUS:
      emoji = '📦';
      break;
  }

  const { topHeaderTitle } = currentRoute;

  return (
    <nav className="flex h-14 items-center justify-between px-5">
      <Logo className="h-7 text-slate-900" />
      <div className="flex items-center gap-3">
        {topHeaderTitle ? (
          <h1 className="text-lg font-semibold">{t(topHeaderTitle)}</h1>
        ) : null}
        {emoji ? <span className="text-2xl">{emoji}</span> : null}
      </div>
    </nav>
  );
};
