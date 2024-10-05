'use client';

import { usePathname } from 'next/navigation';

import { BiArrowBack, BiHomeCircle } from 'react-icons/bi';

import { useTranslation } from '@/app/i18n/client';
import { CustomIconButton } from '@/components/CustomIconButton';
import { SESSION } from '@/constants/storage-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { useHistoryStore } from '@/stores/history';
import { findRoute } from '@/utils/findRoute';

export const BackHeader = () => {
  const router = useCustomRouter();
  const isReload = useHistoryStore((state) => state.lastRouteType === 'reload');
  const BackIcon = isReload ? BiHomeCircle : BiArrowBack;
  const pathname = usePathname();
  const currentRoute = findRoute(pathname);
  const { topHeaderTitle } = currentRoute;
  const { t } = useTranslation('layout');

  return (
    <nav className="flex h-14 items-center justify-between bg-slate-850 px-5">
      <CustomIconButton
        variant="ghost"
        onClick={() => {
          if (isReload) {
            sessionStorage.setItem(SESSION.ROOT_NAV_ANIMATION, 'left');
            router.replace(ROUTES.CHATTING_LIST.pathname);
          } else {
            router.back();
          }
        }}
      >
        <BackIcon className="size-6 text-slate-50" />
      </CustomIconButton>
      {topHeaderTitle ? (
        <h1 className="text-lg font-semibold text-gray-700">
          {t(topHeaderTitle)}
        </h1>
      ) : null}
    </nav>
  );
};
