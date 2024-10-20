'use client';

import { useEffect, useState } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { useGlobalStore } from '@/stores/global';

export const LogoutButton = () => {
  const { t } = useTranslation('more');
  const [isLogouting, setIsLogouting] = useState(false);

  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  useEffect(() => {
    if (!isLogouting) return;

    sessionStorage.setItem(SESSION_STORAGE.LOGOUT_MARK, 'true');

    return () => {
      //! next auth 자체 redirect는 새로 고치기 전까지 세션을 초기화 하지 못하는 버그가 있음
      location.reload();
    };
  }, [isLogouting]);

  return (
    <CustomButton
      className="flex w-full items-center justify-between rounded-none text-slate-50"
      type="submit"
      variant="ghost"
      onClick={() => {
        setIsLogouting(true);
        setIsLoading(true);
      }}
    >
      {t('logout')}
      <RiLogoutBoxRLine className="size-5" />
    </CustomButton>
  );
};
