'use client';

import { usePathname } from 'next/navigation';

import { RiArrowGoBackFill, RiCloseLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomIconButton } from '@/components/CustomIconButton';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { useHistoryStore } from '@/stores/history';
import { cn } from '@/utils/cn';
import { findRoute } from '@/utils/findRoute';

export const BackHeader = () => {
  const router = useCustomRouter();
  const isReload = useHistoryStore((state) => state.lastRouteType === 'reload');

  const pathname = usePathname();
  const currentRoute = findRoute(pathname);

  const isLoginPage = currentRoute === ROUTES.LOGIN;

  const BackIcon = isLoginPage ? RiCloseLine : RiArrowGoBackFill;

  const { topHeaderTitle } = currentRoute;
  const { t } = useTranslation('layout');

  const setRootNavAnimation = useHistoryStore(
    (state) => state.setRootAnimation,
  );

  return (
    <nav
      className={cn(
        'flex h-14 items-center justify-between bg-slate-850 px-5',
        {
          'justify-end': isLoginPage,
        },
      )}
    >
      <CustomIconButton
        variant="ghost"
        onClick={() => {
          if (isReload) {
            setRootNavAnimation('left-out');
            router.replace(ROUTES.CHATTING_LIST.pathname);
          } else {
            router.back();
          }
        }}
      >
        <BackIcon
          className={cn('text-slate-50', isLoginPage ? 'size-8' : 'size-6')}
        />
      </CustomIconButton>
      {topHeaderTitle ? (
        <h1 className="text-lg font-semibold text-gray-700">
          {t(topHeaderTitle)}
        </h1>
      ) : null}
    </nav>
  );
};
