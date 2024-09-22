'use client';

import { usePathname } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import Logo from '@/assets/logo.svg';
import { ROUTES } from '@/routes/client';
import { findCurrentRoute } from '@/utils';

export const RootHeader = () => {
  const { t } = useTranslation('layout');

  const pathname = usePathname();

  const route = findCurrentRoute(pathname);

  const titleKey = '';

  console.log(route === ROUTES.CHATTING);

  return (
    <nav className="flex h-14 items-center justify-between bg-white px-5">
      <Logo className="h-7 text-gray-600" />
      <h1>{t('chat-title')}</h1>
    </nav>
  );
};
