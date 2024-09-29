'use client';

import { BiArrowBack, BiHomeCircle } from 'react-icons/bi';

import { CustomIconButton } from '@/components/CustomIconButton';
import { SESSION } from '@/constants/storage-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { useHistoryStore } from '@/stores/history';

export const BackHeader = () => {
  const router = useCustomRouter();
  const isReload = useHistoryStore((state) => state.lastRouteType === 'reload');
  const BackIcon = isReload ? BiHomeCircle : BiArrowBack;

  return (
    <nav className="flex h-14 items-center justify-between bg-white px-5">
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
        <BackIcon className="size-6" />
      </CustomIconButton>
    </nav>
  );
};
