'use client';

import { usePathname } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import { ROUTES } from '@/routes/client';
import Logo from '@/svgs/logo.svg';
import { ERROR } from '@/utils/customError';
import { findRoute } from '@/utils/findRoute';

export const RootHeader = () => {
  const { t } = useTranslation('layout');

  const pathname = usePathname();

  const currentRoute = findRoute(pathname);

  let emoji = '';

  switch (currentRoute) {
    case ROUTES.CHATTING_LIST:
      emoji = '💬';
      break;
    case ROUTES.INVITE_CHAT:
      emoji = '📨';
      break;
    default:
      emoji = '📦';
      break;
  }

  const { topHeaderTitle } = currentRoute;

  if (!topHeaderTitle) throw ERROR.NOT_ENOUGH_PARAMS(['topHeaderTitle']);

  return (
    <nav className="flex h-14 items-center justify-between bg-slate-850 px-5">
      <Logo className="h-7 text-slate-50" />
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-50">
          {t(topHeaderTitle)}
        </h1>
        <span className="text-2xl">{emoji}</span>
      </div>
    </nav>
  );
};
