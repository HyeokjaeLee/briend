import Link from 'next/link';

import type { IconType } from 'react-icons/lib';
import { VscHome, VscEllipsis, VscCommentDiscussion } from 'react-icons/vsc';

import { translation, useTranslation } from '@/app/i18n';
import { ROUTES } from '@/routes/client';
import { findCurrentRoute } from '@/utils';

interface RootNavProps {
  pathname: string;
}

interface NavigationItem {
  icon: IconType;
}

export const RootNav = ({ pathname }: RootNavProps) => {
  const currentRoute = findCurrentRoute(pathname);
  const { t } = useTranslation('layout');

  return (
    <nav className="flex justify-center rounded-t-md border-t border-zinc-700 bg-zinc-800 px-6 py-3">
      <ul className="flex w-full max-w-96 justify-between gap-10">
        <li>
          <Link
            className="flex flex-col items-center justify-center gap-1 text-xs"
            href={ROUTES.HOME.pathname}
          >
            <VscHome className="size-6" />
            {t('home')}
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col items-center justify-center gap-1 text-xs"
            href={ROUTES.HOME.pathname}
          >
            <VscCommentDiscussion className="size-6" />
            {t('message')}
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col items-center justify-center gap-1 text-xs text-primary"
            href={ROUTES.HOME.pathname}
          >
            <VscEllipsis className="size-6" />
            {t('more')}
          </Link>
        </li>
      </ul>
    </nav>
  );
};
