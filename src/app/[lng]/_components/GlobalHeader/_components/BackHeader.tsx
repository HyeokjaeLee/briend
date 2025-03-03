'use client';

import { usePathname } from 'next/navigation';
import { RiArrowGoBackFill, RiCloseLine } from 'react-icons/ri';

import { Button } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { cn, findRoute } from '@/utils';

export const BackHeader = () => {
  const router = useCustomRouter();

  const pathname = usePathname();
  const currentRoute = findRoute(pathname);

  const isLoginPage = currentRoute === ROUTES.LOGIN;

  const BackIcon = isLoginPage ? RiCloseLine : RiArrowGoBackFill;

  const { topHeaderTitle } = currentRoute;
  const { t } = useTranslation('layout');

  return (
    <nav
      className={cn('flex h-14 items-center justify-between px-1', {
        'justify-end': isLoginPage,
      })}
    >
      <Button variant="ghost" onClick={() => router.back()} onlyIcon>
        <BackIcon />
      </Button>
      {topHeaderTitle ? (
        <h1 className="text-lg font-semibold text-gray-700">
          {t(topHeaderTitle)}
        </h1>
      ) : null}
    </nav>
  );
};
